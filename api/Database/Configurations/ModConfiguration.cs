using FFXVIModManager.Database.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.ValueGeneration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;

namespace FFXVIModManager.Database.Configurations
{
    public class ModConfiguration : IEntityTypeConfiguration<Mod>
    {
        public void Configure(EntityTypeBuilder<Mod> entity)
        {
            entity.Property(e => e.ModId).HasValueGenerator<GuidValueGenerator>();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()");

            entity.HasOne(e => e.Author)
                .WithMany(e => e.Mods)
                .HasForeignKey(e => e.AuthorId);

            entity.HasOne(e => e.CreatedBy)
                .WithMany(e => e.ModsCreated)
                .HasForeignKey(e => e.CreatedById)
                .IsRequired();

            entity.HasOne(e => e.UpdatedBy)
                .WithMany(e => e.ModsUpdated)
                .HasForeignKey(e => e.UpdatedById);
        }
    }
}
