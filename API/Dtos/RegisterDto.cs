using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class RegisterDto
    {
        [Required]
        public string UserName { get; set; }
        
        [Required]
        [StringLength(32, MinimumLength = 6)]
        public string Password { get; set; }
    }
}