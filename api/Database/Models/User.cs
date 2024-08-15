using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FFXVIModManager.Database.Models
{
    public class User
    {
        public required Guid UserId { get; set; }
        public required string Username { get; set; }

        public string? Avatar { get; set; }
        public string? DiscordId { get; set; }

        public ICollection<Mod> Mods { get; set; } = [];

        public ICollection<Mod> ModsCreated { get; set; } = [];
        public ICollection<Mod> ModsUpdated { get; set; } = [];

        public ICollection<ModVersion> ModVersionsCreated { get; set; } = [];
        public ICollection<ModVersion> ModVersionsUpdated { get; set; } = [];
    }
}
