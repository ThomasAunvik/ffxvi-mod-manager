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
    public class ModVersionConfiguration : IEntityTypeConfiguration<ModVersion>
    {
        public void Configure(EntityTypeBuilder<ModVersion> entity)
        {
            entity.Property(e => e.ModId).HasValueGenerator<GuidValueGenerator>();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("now()");

            entity.HasOne(e => e.CreatedBy)
                .WithMany(e => e.ModVersionsCreated)
                .HasForeignKey(e => e.CreatedById)
                .IsRequired();

            entity.HasOne(e => e.UpdatedBy)
                .WithMany(e => e.ModVersionsUpdated)
                .HasForeignKey(e => e.UpdatedById);
        }
    }
}
