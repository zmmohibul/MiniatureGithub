using System;
using Microsoft.EntityFrameworkCore;

namespace API.Models
{
    [Index(nameof(UserName), IsUnique = true)]
    public class User
    {
        public int Id { get; set; }
        
        public string UserName { get; set; }
        
        public byte[] PasswordHash { get; set; }
        
        public byte[] PasswordSalt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}