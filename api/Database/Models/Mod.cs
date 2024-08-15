using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FFXVIModManager.Database.Models
{
    public class Mod
    {
        public required Guid ModId { get; set; }

        public required string Name { get; set; } = string.Empty;
        public Uri? IconUrl { get; set; }

        public required string Description { get; set; } = string.Empty;

        public ICollection<ModExternalLink> ExternalLinks { get; set; } = [];

        public Guid? AuthorId { get; set; }
        public User? Author { get; set; }


        public DateTime CreatedAt { get; set; }
        public Guid CreatedById { get; set; }
        public User? CreatedBy { get; set; }

        public DateTime UpdatedAt { get; set; }
        public Guid? UpdatedById { get; set; }
        public User? UpdatedBy { get; set; }        
    }
}
