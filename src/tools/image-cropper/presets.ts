export interface SocialPreset {
  id: string;
  platform: string;
  label: string;
  width: number;
  height: number;
}

export const socialPresets: SocialPreset[] = [
  { id: "fb-profile", platform: "Facebook", label: "Profile Picture", width: 320, height: 320 },
  { id: "fb-cover", platform: "Facebook", label: "Cover Photo", width: 820, height: 312 },
  { id: "fb-post", platform: "Facebook", label: "Shared Post Image", width: 1200, height: 630 },
  { id: "ig-profile", platform: "Instagram", label: "Profile Picture", width: 320, height: 320 },
  { id: "ig-square", platform: "Instagram", label: "Square Post", width: 1080, height: 1080 },
  { id: "ig-portrait", platform: "Instagram", label: "Portrait Post", width: 1080, height: 1350 },
  { id: "ig-story", platform: "Instagram", label: "Story / Reel", width: 1080, height: 1920 },
  { id: "li-profile", platform: "LinkedIn", label: "Profile Picture", width: 400, height: 400 },
  { id: "li-banner", platform: "LinkedIn", label: "Cover Banner", width: 1584, height: 396 },
  { id: "x-profile", platform: "X / Twitter", label: "Profile Picture", width: 400, height: 400 },
  { id: "x-header", platform: "X / Twitter", label: "Header Banner", width: 1500, height: 500 },
  { id: "yt-profile", platform: "YouTube", label: "Channel Profile", width: 800, height: 800 },
  { id: "yt-banner", platform: "YouTube", label: "Channel Banner", width: 2560, height: 1440 },
  { id: "yt-thumb", platform: "YouTube", label: "Video Thumbnail", width: 1280, height: 720 },
  { id: "tiktok-profile", platform: "TikTok", label: "Profile Picture", width: 200, height: 200 },
  { id: "pinterest-profile", platform: "Pinterest", label: "Profile Picture", width: 165, height: 165 },
  { id: "pinterest-pin", platform: "Pinterest", label: "Standard Pin", width: 1000, height: 1500 },
  { id: "whatsapp-profile", platform: "WhatsApp", label: "Profile Picture", width: 500, height: 500 },
];

export function groupPresetsByPlatform(presets: SocialPreset[]): Record<string, SocialPreset[]> {
  const groups: Record<string, SocialPreset[]> = {};
  for (const preset of presets) {
    (groups[preset.platform] ??= []).push(preset);
  }
  return groups;
}
