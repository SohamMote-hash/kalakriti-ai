"use client";

import { useState } from "react";
import { CheckCircle2, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArtisanAvatar } from "@/components/shared/artisan-avatar";
import { currentArtisan } from "@/data/seedArtisans";

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: currentArtisan.name,
    location: currentArtisan.location,
    state: currentArtisan.state,
    craftSpecialization: currentArtisan.craftSpecialization,
    bio: currentArtisan.bio,
  });
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-foreground md:text-3xl">Settings</h1>
      <p className="mt-1 text-foreground-muted">Manage your artisan profile and business details.</p>

      <Card className="mt-6 p-6">
        <div className="flex items-center gap-4">
          <ArtisanAvatar artisan={currentArtisan} className="h-16 w-16 text-xl" />
          <div>
            <p className="font-display text-base font-semibold text-foreground">{form.name}</p>
            <p className="text-sm text-foreground-muted">
              Member since {currentArtisan.memberSince} · {currentArtisan.rating}★ rating
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="craft">Craft Specialization</Label>
            <Input
              id="craft"
              value={form.craftSpecialization}
              onChange={(e) => setForm((f) => ({ ...f, craftSpecialization: e.target.value }))}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="location">City</Label>
            <Input id="location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="state">State</Label>
            <Input id="state" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} />
          </div>
        </div>

        <div className="mt-4 grid gap-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            className="min-h-[110px]"
          />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4" /> Save Changes
          </Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" /> Saved
            </span>
          )}
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <p className="font-display text-base font-semibold text-foreground">AI Preferences</p>
        <p className="mt-1 text-sm text-foreground-muted">
          Kalakriti AI automatically falls back to offline mock generation when no AI API key is
          configured, so every feature works fully without setup.
        </p>
      </Card>
    </div>
  );
}
