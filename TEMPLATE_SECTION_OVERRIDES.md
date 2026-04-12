# Template Section Overrides Guide

This project supports per-theme section Vue overrides with automatic fallback to the default section component.

## Goal

When you create a new template/theme, you can manually add custom section UI files.

Example:

- `components/sections/themes/luxury/BrideGroom.vue`
- `components/sections/themes/luxury/Cover.vue`

If an override file does not exist, the app uses the default section from `components/sections`.

## Folder Structure

```txt
components/
  sections/
    BrideGroom.vue
    Cover.vue
    ...
    themes/
      luxury/
        BrideGroom.vue
        Cover.vue
      minimal/
        Gallery.vue
```

## Override Naming Rules

Use these component names for built-in section types:

- `cover` -> `Cover.vue`
- `bride_groom` -> `BrideGroom.vue`
- `countdown` -> `Countdown.vue`
- `event_details` -> `EventDetails.vue`
- `love_story` -> `LoveStory.vue`
- `gallery` -> `Gallery.vue`
- `rsvp` -> `Rsvp.vue`
- `guest_wishes` -> `Wishes.vue`
- `digital_gift` -> `Gift.vue`
- `live_stream` -> `LiveStream.vue`
- `closing` -> `Closing.vue`

For custom section types (example: `music_player`), the resolver also checks PascalCase:

- `music_player` -> `MusicPlayer.vue`

Put custom theme override files under:

- `components/sections/themes/<theme>/<ComponentName>.vue`

## Fallback Behavior

1. Try theme override component.
2. If not found, use default component in `components/sections` (for built-in section types).
3. If section type has no mapped component, render generic fallback block.

## Props For Custom Components

Built-in section renderers pass specific props for each section type.

For unknown/custom section types rendered via theme override, generic props are passed:

- `invitation`
- `section`
- `settings`
- `invitationOpened`
- `guestName`

Example custom file:

```vue
<template>
  <section class="py-16 px-6 text-center">
    <h2 class="text-3xl font-semibold">{{ section.title || 'Custom Section' }}</h2>
    <p class="mt-3 text-sm text-gray-600">Guest: {{ guestName || '-' }}</p>
    <pre class="mt-4 text-left text-xs bg-gray-100 p-3 rounded">{{ settings }}</pre>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  invitation?: Record<string, any>
  section: Record<string, any>
  settings?: Record<string, any>
  invitationOpened?: boolean
  guestName?: string
}>()
</script>
```

## Quick Start

1. Choose a theme key (example: `luxury`).
2. Create folder: `components/sections/themes/luxury`.
3. Add only sections you want to override, such as `BrideGroom.vue`.
4. Leave other sections empty; they auto-fallback to default.
5. Reload page and test invitation with that theme.

## Ready Theme: simple

This repository now includes a ready-to-use `simple` theme.

- Theme key: `simple`
- Goal: simple look with full section set enabled by default order
- Section order: `cover`, `bride_groom`, `countdown`, `event_details`, `love_story`, `gallery`, `rsvp`, `guest_wishes`, `digital_gift`, `live_stream`, `closing`
- Full override scaffold is created in: `components/sections/themes/simple/*.vue`

You can select it from invitation create/edit forms.
