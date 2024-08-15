using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FFXVIModManager.Database.Models
{
    public class ModVersion
    {
        public required Guid ModVersionId { get; set; }
        public required Guid ModId { get; set; }

        public Mod? Mod { get; set; }


        public required string Version { get; set; } = string.Empty;
        public required string Title { get; set; } = string.Empty;
        public required string Description { get; set; } = string.Empty;
        public required string Changelog { get; set; } = string.Empty;

        public Uri? DownloadUrl { get; set; }

        public DateTime CreatedAt { get; set; }
        public Guid CreatedById { get; set; }
        public User? CreatedBy { get; set; }

        public DateTime UpdatedAt { get; set; }
        public Guid? UpdatedById { get; set; }
        public User? UpdatedBy { get; set; }

    }
}
