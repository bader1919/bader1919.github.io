# Phase 0 Research – Content Migration

## Decision Log

### Migration Approach

- **Decision**: Manual content conversion with validation rather than automated scraping
- **Rationale**: Projects have varied structure (some with PowerPoint, Excel, PDFs) that requires human judgment for proper narrative extraction. Ensures quality over speed.
- **Alternatives Considered**:
  - **Full automation**: Rejected because README formats are inconsistent and lack sufficient metadata for automated extraction
  - **Template-based forms**: Rejected because it doesn't leverage existing content effectively

### Content Extraction Strategy

- **Decision**: Extract metadata from existing READMEs and file listings; manually craft narratives that incorporate key insights from presentations and data files
- **Rationale**: Preserves original voice and insights while restructuring for the new format. Allows incorporation of visual/data artifacts into narrative flow.
- **Alternatives Considered**:
  - **Copy-paste READMEs verbatim**: Rejected because READMEs vary widely in quality and completeness
  - **AI-generated summaries**: Rejected to maintain authentic project voice and accuracy

### Publication Date Assignment

- **Decision**: Use Git file history timestamps for initial commit dates as publication dates; manual override if timestamp is clearly incorrect
- **Rationale**: Provides deterministic, verifiable dates. Git history already exists for most projects.
- **Alternatives Considered**:
  - **Arbitrary dates**: Rejected because it loses historical accuracy
  - **Manual dating only**: Rejected because it's error-prone and time-consuming

### Asset Handling

- **Decision**: Document asset locations in narrative Markdown using relative links; keep large assets (Excel, PowerPoint, PDFs) in original locations with links; move only images to new structure
- **Rationale**: Preserves file provenance, avoids repository bloat, maintains access to supporting materials.
- **Alternatives Considered**:
  - **Move all assets**: Rejected due to file size and repository organization concerns
  - **External hosting**: Rejected to keep portfolio self-contained

### Tag Generation

- **Decision**: Extract tags from tech stack mentions in READMEs plus domain keywords (e.g., "Data Analytics," "Market Research")
- **Rationale**: Ensures consistent taxonomy while respecting original project categorization.
- **Alternatives Considered**:
  - **Fixed tag list**: Rejected as too rigid
  - **Free-form tags**: Rejected as inconsistent

### Migration Validation

- **Decision**: Three-level validation: (1) Markdown syntax lint, (2) Build pipeline success, (3) Visual inspection of generated pages
- **Rationale**: Catches errors at syntax, integration, and UX layers.
- **Alternatives Considered**:
  - **Build-only validation**: Rejected as insufficient for content quality
  - **Manual review only**: Rejected as non-repeatable

## Outstanding Questions

- None. All ambiguities from spec resolved through decision log above.
