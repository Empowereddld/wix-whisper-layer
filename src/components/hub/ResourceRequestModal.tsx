import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  userId?: string;
}

const ResourceRequestModal = ({ open, onClose, userId }: Props) => {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [context, setContext] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!userId || !topic || !audience) return;
    setSubmitting(true);
    const { error } = await supabase.from("resource_requests").insert({
      user_id: userId,
      topic,
      audience,
      context: context || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      toast.success("Thank you! We'll take a look.");
      setTopic("");
      setAudience("");
      setContext("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-midnight">Can't find what you need?</DialogTitle>
          <DialogDescription>Tell us what would help you most. We read every request.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <label className="text-sm font-medium text-midnight mb-1 block">Resource topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Visual schedule for DLD"
              className="w-full h-10 px-3 rounded-lg border border-thistle bg-card text-sm focus:outline-none focus:ring-2 focus:ring-hub-lavender"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-midnight mb-1 block">Who is it for?</label>
            <Select value={audience} onValueChange={setAudience}>
              <SelectTrigger className="border-thistle"><SelectValue placeholder="Select audience" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Parents">Parents</SelectItem>
                <SelectItem value="Therapists">Therapists</SelectItem>
                <SelectItem value="Educators">Educators</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-midnight mb-1 block">Any extra context <span className="text-stone-ui">(optional)</span></label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-thistle bg-card text-sm focus:outline-none focus:ring-2 focus:ring-hub-lavender resize-none"
            />
          </div>
          <Button onClick={handleSubmit} disabled={submitting || !topic || !audience} className="w-full bg-mauve text-white hover:bg-mauve/90">
            {submitting ? "Sending…" : "Send Request →"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResourceRequestModal;
