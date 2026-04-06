# Wedding Invitation SaaS Platform (Advanced Specification)

## Project Goal

Build a **fullstack SaaS platform for digital wedding invitations** similar to modern invitation services.

The platform allows users to:

• Create personalized wedding invitations  
• Share invitations through custom URLs  
• Collect RSVP responses  
• Display photo/video galleries  
• Manage guest lists  
• Provide digital gift information  
• Track analytics of invitation views  

The system must be **mobile-first**, elegant, scalable, and optimized for social sharing.

---

# Technology Stack

Frontend
- Nuxt 3
- Vue 3
- TypeScript
- TailwindCSS
- Pinia

Backend
- Nuxt Server Routes
- Node.js runtime
- Prisma ORM
- PostgreSQL

Authentication
- JWT

Media Storage
- S3 compatible storage
- Cloudflare R2
- AWS S3
- Google Drive adapter

Deployment
- Docker
- Kubernetes compatible

---

# Core System Architecture

User → Dashboard → Invitation Editor → Publish → Guest View

Guest → Invitation Page → RSVP → Message → Gift

Admin → Monitor → Analytics → Manage Users

---

# URL Structure

Each invitation has a unique slug.

Example:

/[slug]?to=Guest+Name

Example:

/ryan-yulia?to=John+Doe

Behavior:

Guest name appears on invitation cover.

Example display:

Dear John Doe  
You are invited to our wedding.

---

# Invitation Page Sections

The invitation page is built as **scrollable sections**.

Sections must be modular components.

---

# Section 1 — Cover

First screen shown before invitation opens.

Fields

bride_name  
groom_name  
wedding_date  
cover_photo  
background_music  
guest_name  

Elements

Open Invitation Button  
Background animation  
Music autoplay after click

---

# Section 2 — Bride & Groom

Display profiles of both partners.

Bride fields

name  
photo  
father_name  
mother_name  
instagram  

Groom fields

name  
photo  
father_name  
mother_name  
instagram  

---

# Section 3 — Countdown

Countdown until wedding date.

Logic

countdown = wedding_date - current_time

Display

Days  
Hours  
Minutes  
Seconds

---

# Section 4 — Event Details

Multiple wedding events supported.

Example

Akad  
Reception  

Fields

event_name  
date  
time  
venue  
address  
google_maps_link  

---

# Section 5 — Love Story

Timeline describing the couple’s journey.

Fields

year  
title  
description  
photo  

Example

2019 — First Meet  
2022 — Engagement  
2025 — Wedding  

---

# Section 6 — Gallery

Media gallery.

Supported media

Image  
YouTube video  
MP4 video  

Fields

type  
url  
caption  
display_order  

---

# Section 7 — RSVP

Guest attendance confirmation.

Fields

guest_name  
phone  
attendance  
guest_count  
message  

Attendance values

yes  
no  

Store responses in database.

---

# Section 8 — Guest Wishes

Guests send congratulations messages.

Fields

name  
message  
created_at  

Messages displayed in timeline.

---

# Section 9 — Digital Gift

Display bank accounts for wedding gifts.

Fields

bank_name  
account_number  
account_holder  
qr_code  

Example

Bank BCA  
Account 123456789  
Ryan Pratama  

---

# Section 10 — Live Streaming

Embed livestream if available.

Field

youtube_url

---

# Section 11 — Closing

Closing message.

Fields

closing_message  
couple_name  

Example

Thank you for your blessings.

Ryan & Yulia

---

# Guest QR Check-In System

Each guest receives a QR code.

QR code contains

guest_id  
invitation_id  

At venue entrance

Scanner reads QR code  
Marks guest as arrived.

Fields

guest_id  
checked_in  
checkin_time

---

# WhatsApp Invitation Generator

Users can generate invitation messages.

Example template

Hello {{guest_name}}

You are invited to the wedding of

{{groom_name}} & {{bride_name}}

Date: {{wedding_date}}

Open invitation:

{{invitation_url}}

Features

Generate WhatsApp link  
Copy message button  

---

# Invitation Themes System

Support multiple visual themes.

Each theme contains

color_palette  
font_family  
layout_style  
animations  

Theme examples

classic  
minimal  
luxury  
floral  

Users can select theme in dashboard.

---

# Admin Dashboard Features

Dashboard must include:

Create invitation  
Edit invitation  
Upload gallery  
Manage events  
Manage guest list  
Import guests via Excel  
View RSVP responses  
View guest wishes  
Configure bank accounts  
Select invitation theme  
Generate WhatsApp links  

---

# Analytics System

Track invitation performance.

Metrics

invitation_views  
unique_visitors  
rsvp_count  
guest_messages  

Fields

invitation_id  
view_count  
visitor_ip  
visit_time  

Dashboard charts required.

---

# Database Schema

## Users

id  
name  
email  
password  
plan  
created_at  

---

## Invitations

id  
user_id  
slug  
bride_name  
groom_name  
wedding_date  
cover_photo  
music_url  
theme  
created_at  

---

## Events

id  
invitation_id  
title  
date  
time  
venue  
address  
maps_link  

---

## Gallery

id  
invitation_id  
type  
url  
caption  
display_order  

---

## Guests

id  
invitation_id  
name  
phone  
qr_code  
checked_in  

---

## RSVP

id  
invitation_id  
guest_name  
attendance  
guest_count  
message  
created_at  

---

## Wishes

id  
invitation_id  
name  
message  
created_at  

---

## Bank Accounts

id  
invitation_id  
bank_name  
account_number  
account_holder  
qr_code  

---

## Analytics

id  
invitation_id  
visitor_ip  
visit_time  

---

# API Endpoints

Invitations

POST /api/invitations  
GET /api/invitations/:slug  
PUT /api/invitations/:id  
DELETE /api/invitations/:id  

RSVP

POST /api/rsvp  

Guest Wishes

POST /api/wishes  

Gallery

POST /api/gallery  
DELETE /api/gallery/:id  

Guests

POST /api/guests  
POST /api/guests/import  

Analytics

POST /api/analytics/view  

---

# File Structure

/pages  
/dashboard  
/invitation/[slug]

/components  
Cover.vue  
BrideGroom.vue  
Countdown.vue  
EventDetails.vue  
LoveStory.vue  
Gallery.vue  
RSVP.vue  
Wishes.vue  
Gift.vue  
Closing.vue  

/server/api  
invitations  
rsvp  
wishes  
guests  
gallery  

/prisma  
schema.prisma  

---

# UI Requirements

Design must be:

mobile-first  
smooth scroll  
romantic color palette  
soft animations  
background music  
elegant typography  

TailwindCSS required.

---

# SaaS Monetization (Optional)

Plans

Free

• 1 invitation  
• limited gallery  

Premium

• unlimited gallery  
• custom domain  
• advanced themes  

Enterprise

• multiple invitations  
• analytics dashboard  
• priority support  

---

# Expected Output

Generate a complete Nuxt 3 project including:

• authentication system  
• dashboard UI  
• invitation editor  
• public invitation page  
• RSVP system  
• guest messaging system  
• gallery upload  
• analytics tracking  
• theme system  

Code must be modular, scalable, and production ready.


# Dynamic Section System

The invitation system must support **dynamic sections**.

Each invitation template is composed of **multiple sections that can be enabled, disabled, added, or removed** by the user.

Users can customize the structure of their invitation.

Example invitation layout:

Cover  
Bride & Groom  
Countdown  
Event Details  
Love Story  
Gallery  
RSVP  
Guest Wishes  
Digital Gift  
Closing

Users can modify this order and visibility.

---

# Section Configuration

Each section must contain the following properties:

section_id  
invitation_id  
type  
title  
enabled  
order  
settings  

Example JSON structure

{
  "section_id": "gallery",
  "enabled": true,
  "order": 5,
  "settings": {
    "layout": "grid",
    "columns": 3
  }
}

---

# Supported Section Types

The system must support these default sections:

cover  
bride_groom  
countdown  
event_details  
love_story  
gallery  
rsvp  
guest_wishes  
digital_gift  
live_stream  
closing  

Each section should be implemented as a **reusable Vue component**.

---

# Section Customization

Users must be able to:

• enable or disable sections  
• reorder sections (drag and drop)  
• edit section content  
• delete sections  
• add new sections  

Example:

User deletes "Love Story" section.

The invitation page updates automatically.

---

# Custom Sections

Users may create additional custom sections.

Example:

Photo Booth Section  
Wedding Dress Code  
Health Protocol  
Special Message  

Custom section fields:

title  
content  
images  
order  

---

# Template System

Templates define:

layout  
color palette  
fonts  
animations  
default sections  

Each template provides a **default section configuration**.

Example template configuration:

{
  "template_name": "romantic_classic",
  "sections": [
    "cover",
    "bride_groom",
    "countdown",
    "event_details",
    "gallery",
    "rsvp",
    "guest_wishes",
    "closing"
  ]
}

Users can modify this list after selecting the template.

---

# Database Schema for Sections

Add new table.

## Sections

Fields:

id  
invitation_id  
type  
title  
enabled  
display_order  
settings_json  

Example settings_json

{
  "layout": "grid",
  "columns": 3
}

---

# Dashboard Section Editor

The invitation editor dashboard must include a **Section Builder UI**.

Features:

• drag and drop section ordering  
• toggle section visibility  
• edit section content  
• delete sections  
• add new sections  

UI components required:

SectionList  
SectionEditor  
SectionSettings  
SectionPreview  

---

# Rendering Logic

The public invitation page must render sections dynamically.

Example pseudocode:

sections = getSections(invitation_id)

for each section in sections ordered by display_order:
    if section.enabled:
        render component based on section.type

Example mapping:

cover → Cover.vue  
gallery → Gallery.vue  
rsvp → RSVP.vue  

---

# Expected Result

The system must allow:

• dynamic invitation layouts  
• customizable templates  
• reusable section components  
• drag-and-drop editing  

Users can create completely different invitation structures using the same template.
