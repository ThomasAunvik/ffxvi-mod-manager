using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FFXVIModManager.Database.Models
{
    public class ModExternalLink
    {
        public required Guid Id { get; set; }
        public required Guid ModId { get; set; }
        public Mod? Mod { get; set; }

        public required string LinkType { get; set; }
        public required Uri Uri { get; set; }
    }
}
