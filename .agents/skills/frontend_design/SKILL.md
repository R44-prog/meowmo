---
name: frontend_design
description: A specialized skill for generating high-quality, distinctive, and non-generic frontend designs using React and Tailwind CSS. Use this to avoid "AI Slop" and create premium, polished interfaces.
---

# Frontend Design Skill 🎨

## When to use
Use this skill when the user asks for a new UI component, a page redesign, or a "polish" pass on an existing interface. This skill is particularly effective for:
- Creating "wow" moments (Landing Pages, Dashboards).
- Implementing complex interactive elements (Cards, Lists, Modals).
- ensure visual consistency through a Design System approach.

## Core Principles

### 1. Avoid "AI Slop" 🚫
- **Typography**: Do NOT use default Inter/Roboto/Arial if possible. Suggest pairing a distinctive display font (Serif or Display sans) with a clean body font.
- **Colors**: Avoid "Purple Gradients on White". Use sophisticated, harmonious palettes (using `hsl()` or Tailwind colors). Deep forest greens, warm clays, slate blues > Neon Purple.
- **Layout**: Break the grid. Use asymmetry, overlap, and interesting negative space.

### 2. "Paint with Code" 🖌️
- Use `<div>`s for decoration (blobs, glows, dividers).
- Use `backdrop-filter: blur()` for glassmorphism.
- Use `mix-blend-mode` for sophisticated layering.
- Use `box-shadow` layers for depth (not just a single drop shadow).

### 3. Motion & Vibe ✨
- Everything should react to interaction.
- Use `group-hover` in Tailwind for complex hover states.
- Use `animate-in` (tailwindcss-animate) for entrance sequences.

## XML Prompt Structure
When designing, structure your thinking (or output) using these tags:

```xml
<frontend_aesthetics>
  <font_choice>
    <!-- Specify generic font families that mimic premium fonts -->
    <!-- e.g. font-serif for headers, font-mono for numbers -->
  </font_choice>
  <color_palette>
    <!-- Define the mood: "Warm Industrial", "Cyber Nature", etc. -->
  </color_palette>
  <spatial_composition>
    <!-- Describe the layout philosophy: "Bento Grid", "Overlapping Cards", etc. -->
  </spatial_composition>
  <micro_interactions>
    <!-- Details on hover/active states -->
  </micro_interactions>
</frontend_aesthetics>
```

## Example: The "Meowmo" Vibe
For the current project, apply these rules:
- **Shape**: Rounded corners (`rounded-3xl` or `rounded-[2rem]`).
- **Texture**: Paper-like backgrounds (`bg-[#faf9f7]`), subtle grain.
- **Color**: Warm aesthetics (Orange/Yellow/Amber) for happiness.
- **Shadow**: `calm-shadow` (soft, diffuse).

## Instructions
1.  **Analyze** the requirement.
2.  **Define** the aesthetics using the XML structure above.
3.  **Implement** using React + Tailwind.
    - Use `lucide-react` for icons.
    - Use `cn()` for class merging.
    - Ensure Mobile Responsiveness (`md:`, `lg:` prefixes).
