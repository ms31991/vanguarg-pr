using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Net.Mail;
using vanguarg_backhend.Data;
using vanguarg_backhend.DTOs;

namespace vanguarg_backhend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeadsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public LeadsController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> CreateLead([FromBody] LeadRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Name))
                    return BadRequest(new { code = "lead.name_required", message = "Name ist erforderlich." });

                if (string.IsNullOrWhiteSpace(request.Message))
                    return BadRequest(new { code = "lead.message_required", message = "Nachricht ist erforderlich." });

                if (request.ContactMethod != "email" && request.ContactMethod != "phone")
                    return BadRequest(new { code = "lead.invalid_contact_method", message = "Ungültige Kontaktmethode." });

                if (request.ContactMethod == "email" && string.IsNullOrWhiteSpace(request.Email))
                    return BadRequest(new { code = "lead.email_required", message = "E-Mail ist erforderlich." });

                if (request.ContactMethod == "phone" && string.IsNullOrWhiteSpace(request.Phone))
                    return BadRequest(new { code = "lead.phone_required", message = "Telefonnummer ist erforderlich." });

                var lead = new Lead
                {
                    CreatedAt = DateTime.UtcNow,
                    PropertyId = request.PropertyId,
                    PropertyTitle = request.PropertyTitle,
                    Name = request.Name,
                    ContactMethod = request.ContactMethod,
                    Email = request.Email,
                    Phone = request.Phone,
                    Message = request.Message
                };

                _context.Leads.Add(lead);
                await _context.SaveChangesAsync();

                try
                {
                    await SendLeadEmailAsync(lead);
                }
                catch (Exception emailEx)
                {
                    Console.WriteLine($"Email failed: {emailEx.Message}");
                }

                return Ok(new { code = "lead.saved", message = "Anfrage wurde erfolgreich gespeichert." });
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetLeads()
        {
            var leads = await _context.Leads
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(leads);
        }

        private async Task SendLeadEmailAsync(Lead lead)
        {
            var smtpHost = _configuration["EmailSettings:SmtpHost"];
            var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
            var smtpUsername = _configuration["EmailSettings:Username"];
            var smtpPassword = _configuration["EmailSettings:Password"];
            var fromEmail = _configuration["EmailSettings:FromEmail"];
            var toEmail = _configuration["EmailSettings:ToEmail"];

            var subject = $"New Lead: {lead.PropertyTitle}";

            var body = $@"
<html>
<body style='font-family:Arial,sans-serif; color:#333;'>
  <h2 style='color:#1a1a1a;'>New Lead Received</h2>
  <table cellpadding='8' style='border-collapse:collapse;'>
    <tr>
      <td style='font-weight:bold;'>Property:</td>
      <td>{lead.PropertyTitle}</td>
    </tr>
    <tr>
      <td style='font-weight:bold;'>Name:</td>
      <td>{lead.Name}</td>
    </tr>
    <tr>
      <td style='font-weight:bold;'>Contact Method:</td>
      <td>{lead.ContactMethod}</td>
    </tr>
    <tr>
      <td style='font-weight:bold;'>Email:</td>
      <td>{lead.Email ?? "-"}</td>
    </tr>
    <tr>
      <td style='font-weight:bold;'>Phone:</td>
      <td>{lead.Phone ?? "-"}</td>
    </tr>
    <tr>
      <td style='font-weight:bold;'>Message:</td>
      <td>{lead.Message}</td>
    </tr>
    <tr>
      <td style='font-weight:bold;'>Date:</td>
      <td>{lead.CreatedAt:yyyy-MM-dd HH:mm} UTC</td>
    </tr>
  </table>
</body>
</html>";

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUsername, smtpPassword),
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false
            };

            using var mail = new MailMessage()
            {
                From = new MailAddress(fromEmail, "Vanguard Leads"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };

            mail.To.Add(toEmail);
            mail.Headers.Add("X-Priority", "1");

            await client.SendMailAsync(mail);
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            try
            {
                var lead = await _context.Leads.FindAsync(id);
                if (lead == null)
                    return NotFound(new { code = "lead.not_found", message = "Anfrage nicht gefunden." });

                lead.IsRead = true;
                await _context.SaveChangesAsync();

                return Ok(new { code = "lead.marked_read", message = "Anfrage wurde als gelesen markiert." });
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLead(int id)
        {
            try
            {
                var lead = await _context.Leads.FindAsync(id);
                if (lead == null)
                    return NotFound(new { code = "lead.not_found", message = "Anfrage nicht gefunden." });

                _context.Leads.Remove(lead);
                await _context.SaveChangesAsync();

                return Ok(new { code = "lead.deleted", message = "Anfrage wurde gelöscht." });
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }
    }

}