using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using vanguarg_backhend.Data;

namespace vanguarg_backhend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PropertyController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public PropertyController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpGet("/api/property")]
        public IActionResult GetProperties()
        {
            try
            {
                var properties = _context.Properties
                    .Include(p => p.Images)
                    .ToList();

                var resp = properties.Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Description,
                    p.TitleEn,
                    p.DescriptionEn,
                    p.Price,
                    p.City,
                    Images = p.Images.Select(i => new
                    {
                        i.Id,
                        i.ImageUrl
                    }).ToList()
                }).ToList();

                return Ok(resp);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpGet("/api/property/{id}")]
        public IActionResult GetPropertyById(int id)
        {
            try
            {
                var property = _context.Properties
                    .Include(p => p.Images)
                    .FirstOrDefault(p => p.Id == id);

                if (property == null)
                    return NotFound(new { code = "property.not_found", message = "Immobilie nicht gefunden." });

                return Ok(new
                {
                    property.Id,
                    property.Title,
                    property.Description,
                    property.TitleEn,
                    property.DescriptionEn,
                    property.Price,
                    property.City,
                    Images = property.Images.Select(i => new
                    {
                        i.Id,
                        i.ImageUrl
                    }).ToList()
                });
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpGet("/api/property/search")]
        public IActionResult Search(string? city, decimal? minPrice, decimal? maxPrice)
        {
            try
            {
                var query = _context.Properties
                    .Include(p => p.Images)
                    .AsQueryable();

                if (!string.IsNullOrEmpty(city))
                    query = query.Where(p => p.City.ToLower().Contains(city.ToLower()));

                if (minPrice.HasValue)
                    query = query.Where(p => p.Price >= minPrice.Value);

                if (maxPrice.HasValue)
                    query = query.Where(p => p.Price <= maxPrice.Value);

                var resp = query.Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Description,
                    p.TitleEn,
                    p.DescriptionEn,
                    p.Price,
                    p.City,
                    Images = p.Images.Select(i => new
                    {
                        i.Id,
                        i.ImageUrl
                    }).ToList()
                }).ToList();

                return Ok(resp);
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpPost("/api/property")]
        public IActionResult AddProperty(
            [FromForm] string title,
            [FromForm] string description,
            [FromForm] string? titleEn,
            [FromForm] string? descriptionEn,
            [FromForm] decimal price,
            [FromForm] string city,
            [FromForm] List<IFormFile> images)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(title) ||
                    string.IsNullOrWhiteSpace(description) ||
                    string.IsNullOrWhiteSpace(city))
                {
                    return BadRequest(new { code = "property.required_fields", message = "Titel, Beschreibung und Stadt sind erforderlich." });
                }

                var property = new Property
                {
                    Title = title,
                    Description = description,
                    TitleEn = string.IsNullOrWhiteSpace(titleEn) ? null : titleEn,
                    DescriptionEn = string.IsNullOrWhiteSpace(descriptionEn) ? null : descriptionEn,
                    Price = price,
                    City = city
                };

                _context.Properties.Add(property);
                _context.SaveChanges();

                string uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                foreach (var image in images)
                {
                    if (image.Length > 0)
                    {
                        var extension = Path.GetExtension(image.FileName).ToLower();
                        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };

                        if (!allowedExtensions.Contains(extension))
                            return BadRequest(new { code = "property.invalid_image_type", message = "Erlaubt sind nur jpg, jpeg, png, webp." });

                        string uniqueFileName = Guid.NewGuid().ToString() + extension;
                        string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            image.CopyTo(stream);
                        }

                        var propertyImage = new PropertyImage
                        {
                            PropertyId = property.Id,
                            ImageUrl = "/uploads/" + uniqueFileName
                        };

                        _context.PropertyImages.Add(propertyImage);
                    }
                }

                _context.SaveChanges();

                return Ok(new { code = "property.created", message = "Immobilie wurde erfolgreich erstellt (inkl. Bilder)." });
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpPut("/api/property/{id}")]
        public IActionResult UpdateProperty(int id, Property updated)
        {
            try
            {
                var property = _context.Properties.FirstOrDefault(p => p.Id == id);

                if (property == null)
                    return NotFound(new { code = "property.not_found", message = "Immobilie nicht gefunden." });

                property.Title = updated.Title;
                property.Description = updated.Description;
                property.TitleEn = updated.TitleEn;
                property.DescriptionEn = updated.DescriptionEn;
                property.Price = updated.Price;
                property.City = updated.City;

                _context.SaveChanges();

                return Ok(new { code = "property.updated", message = "Immobilie wurde erfolgreich aktualisiert." });
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpDelete("/api/property/{id}")]
        public IActionResult DeleteProperty(int id)
        {
            try
            {
                var property = _context.Properties
                    .Include(p => p.Images)
                    .FirstOrDefault(p => p.Id == id);

                if (property == null)
                    return NotFound(new { code = "property.not_found", message = "Immobilie nicht gefunden." });

                foreach (var img in property.Images)
                {
                    var fullPath = Path.Combine(_env.WebRootPath, img.ImageUrl.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString()));

                    if (System.IO.File.Exists(fullPath))
                        System.IO.File.Delete(fullPath);
                }

                _context.Properties.Remove(property);
                _context.SaveChanges();

                return Ok(new { code = "property.deleted", message = "Immobilie wurde erfolgreich gelöscht." });
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }


        [HttpPost("/api/property/{id}/images")]
        public IActionResult AddImagesToProperty(int id, [FromForm] List<IFormFile> images)
        {
            try
            {
                var property = _context.Properties
                    .Include(p => p.Images)
                    .FirstOrDefault(p => p.Id == id);

                if (property == null)
                    return NotFound(new { code = "property.not_found", message = "Immobilie nicht gefunden." });

                if (images == null || !images.Any())
                    return BadRequest(new { code = "property.no_images", message = "Es wurden keine Bilder zum Hochladen ausgewählt." });

                string uploadsFolder = Path.Combine(_env.WebRootPath, "uploads");

                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };

                foreach (var image in images)
                {
                    if (image.Length > 0)
                    {
                        var extension = Path.GetExtension(image.FileName).ToLower();

                        if (!allowedExtensions.Contains(extension))
                            return BadRequest(new { code = "property.invalid_image_type", message = "Erlaubt sind nur jpg, jpeg, png, webp." });

                        string uniqueFileName = Guid.NewGuid().ToString() + extension;
                        string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            image.CopyTo(stream);
                        }

                        var propertyImage = new PropertyImage
                        {
                            PropertyId = property.Id,
                            ImageUrl = "/uploads/" + uniqueFileName
                        };

                        _context.PropertyImages.Add(propertyImage);
                    }
                }

                _context.SaveChanges();

                return Ok(new { code = "property.images_added", message = "Bilder wurden erfolgreich hinzugefügt." });
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
     }

        [HttpDelete("/api/property/{propertyId}/image/{imageId}")]
        public IActionResult DeleteSingleImage(int propertyId, int imageId)
        {
            try
            {
                var image = _context.PropertyImages
                    .FirstOrDefault(i => i.Id == imageId && i.PropertyId == propertyId);

                if (image == null)
                    return NotFound(new { code = "property.image_not_found", message = "Bild für diese Immobilie nicht gefunden." });

                var fullPath = Path.Combine(
                    _env.WebRootPath,
                    image.ImageUrl.TrimStart('/').Replace("/", Path.DirectorySeparatorChar.ToString())
                );

                if (System.IO.File.Exists(fullPath))
                    System.IO.File.Delete(fullPath);

                _context.PropertyImages.Remove(image);
                _context.SaveChanges();

                return Ok(new { code = "property.image_deleted", message = "Bild wurde erfolgreich gelöscht." });
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }







    }
}