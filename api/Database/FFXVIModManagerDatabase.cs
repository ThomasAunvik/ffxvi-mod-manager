using FFXVIModManager.Database.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace FFXVIModManager.Database
{
    public class FFXVIModManagerDatabase : DbContext
    {
        public FFXVIModManagerDatabase()
        {
        }

        public FFXVIModManagerDatabase(DbContextOptions<FFXVIModManagerDatabase> options)
            : base(options)
        {
        }

        public virtual DbSet<User> Users { get; set; }

        public virtual DbSet<Mod> Mods { get; set; }
        public virtual DbSet<ModExternalLink> ModExternalLinks { get; set; }
        public virtual DbSet<ModVersion> ModVersions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(FFXVIModManagerDatabase).Assembly);
        }
    }
}
