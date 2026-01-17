import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile(data);
      setIsAdmin(data.role === "admin");
      setFullName(data.full_name || "");
      setPhone(data.phone || "");
    }

    setLoading(false);
  }

  async function saveProfile() {
    setLoading(true);

    await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone,
      })
      .eq("id", profile.id);

    alert("Profile updated");
    setLoading(false);
  }

  if (loading) {
    return <DashboardLayout>Loading settings…</DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl">

        {/* PROFILE */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Profile</h2>

          <div className="space-y-4">
            <Input
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Button onClick={saveProfile}>Save Profile</Button>
          </div>
        </Card>

        {/* ADMIN SETTINGS */}
        {isAdmin && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              Studio Settings
            </h2>

            <p className="text-muted-foreground mb-3">
              Branding, logo, and reminder controls
            </p>

            <Button variant="outline">
              Upload Logo (next step)
            </Button>

            <Button variant="outline" className="ml-3">
              Manage Reminders
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
