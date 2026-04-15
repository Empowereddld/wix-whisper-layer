import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { usePurchases } from "@/hooks/usePurchases";
import HubLayout from "@/components/hub/HubLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ArrowLeft, Check, Copy, ChevronDown, ChevronUp, Search } from "lucide-react";

// ─── Resource ID for purchase gating ──────────────────────────────────────────
const IEP_RESOURCE_ID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
const PREVIEW_LIMIT = 4; // show first N goals unlocked for non-purchasers

// ─── Category config ──────────────────────────────────────────────────────────
const CAT_CONFIG: Record<string, { bg: string; border: string; text: string; numBg: string }> = {
  Vocabulary:           { bg: "bg-[#F0EAF9]", border: "border-[#C4A8E8]", text: "text-[#3C1878]", numBg: "bg-[#3C1878]" },
  Grammar:              { bg: "bg-[#E6F5F4]", border: "border-[#9DDDD6]", text: "text-[#1A5C5C]", numBg: "bg-[#1A5C5C]" },
  Narrative:            { bg: "bg-[#F8EEF8]", border: "border-[#D8A8D8]", text: "text-[#6B2D6B]", numBg: "bg-[#6B2D6B]" },
  Reading:              { bg: "bg-[#E8F0FA]", border: "border-[#A8C4E8]", text: "text-[#1A3A5C]", numBg: "bg-[#1A3A5C]" },
  Writing:              { bg: "bg-[#FAF0E6]", border: "border-[#E8C8A0]", text: "text-[#5C3A1A]", numBg: "bg-[#5C3A1A]" },
  "Executive Function": { bg: "bg-muted",     border: "border-border",    text: "text-foreground", numBg: "bg-foreground" },
};

const CAT_LABELS: Record<string, string> = {
  Vocabulary: "Vocabulary",
  Grammar: "Grammar and Sentence Structure",
  Narrative: "Narrative Language",
  Reading: "Reading Comprehension",
  Writing: "Writing",
  "Executive Function": "Executive Function",
};

const FIELD_LABELS: Record<string, string> = {
  date: "Target date", name: "Student name", prompts: "# prompts", sessions: "# sessions",
  measure: "Measured by", correct: "# correct", total: "# total", instances: "# instances",
  wordCount: "# words", features: "# features", material: "Material type", activity: "Activity",
  storyElements: "# story elements", details: "# details", expansionType: "Expansion type",
  strategy: "Strategy", topic: "Topic/skill", rating: "Rating descriptor",
  solutions: "# solutions", redirections: "# redirections", time: "Time limit",
};

interface Goal {
  id: number;
  cat: string;
  sub: string | null;
  preview: string;
  tpl: string;
  fields: string[];
}

// ─── Goal data (50 goals) ─────────────────────────────────────────────────────
const GOALS: Goal[] = [
  // Vocabulary
  { id:1, cat:"Vocabulary", sub:null, preview:"Use strategies to determine meaning of unfamiliar words", tpl:"By {date}, {name} will use strategies (e.g., context clues, visual supports, looking up definitions/synonyms, asking for clarification) to determine the meaning of unfamiliar words independently or with no more than {prompts} prompt(s) per item when reading/listening to {material} in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","material","correct","total","sessions","measure"] },
  { id:2, cat:"Vocabulary", sub:null, preview:"Use graphic organizers for Tier 2 vocabulary word relationships", tpl:"By {date}, {name} will use graphic organizers to visually represent word relationships of _ [number] targeted Tier 2 vocabulary words independently or with no more than {prompts} prompt(s) per word across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","sessions","measure"] },
  { id:3, cat:"Vocabulary", sub:null, preview:"Describe features of vocabulary using a semantic feature organizer", tpl:"By {date}, {name} will describe at least {features} features of targeted vocabulary using a semantic feature organizer independently or with visual supports only or no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","features","prompts","correct","total","sessions","measure"] },
  { id:4, cat:"Vocabulary", sub:null, preview:"Group vocabulary into categories and explain relationships", tpl:"By {date}, {name} will group vocabulary into categories and explain relationships independently or with no more than {prompts} prompt(s) per task in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:5, cat:"Vocabulary", sub:null, preview:"Infer word meanings using context clues", tpl:"By {date}, {name} will infer word meanings of at least {wordCount} target words per session using context clues independently or with no more than {prompts} reminder(s) across {sessions} sessions as measured by {measure}.", fields:["date","name","wordCount","prompts","sessions","measure"] },
  { id:6, cat:"Vocabulary", sub:null, preview:"Identify unknown words and use a repair strategy", tpl:"By {date}, {name} will identify when they do not understand a word and use a strategy to repair understanding in {instances} instances per session independently or with no more than {prompts} prompt(s) across {sessions} sessions as measured by {measure}.", fields:["date","name","instances","prompts","sessions","measure"] },
  // Grammar
  { id:7, cat:"Grammar", sub:null, preview:"Produce sentences with adverbial clauses", tpl:"By {date}, {name} will produce sentences containing adverbial clauses independently or with no more than {prompts} prompt(s) per sentence in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:8, cat:"Grammar", sub:null, preview:"Use correct past tense verb forms", tpl:"By {date}, {name} will use correct past tense verb forms independently or with visual supports only or no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:9, cat:"Grammar", sub:null, preview:"Combine sentences using conjunctions", tpl:"By {date}, {name} will combine sentences using conjunctions in {instances} instances per session independently or with no more than {prompts} prompt(s) across {sessions} sessions as measured by {measure}.", fields:["date","name","instances","prompts","sessions","measure"] },
  { id:10, cat:"Grammar", sub:null, preview:"Combine simple sentences into complex sentences", tpl:"By {date}, {name} will combine simple sentences into more complex sentences independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:11, cat:"Grammar", sub:null, preview:"Expand utterances with prepositional phrases, adjectives, or adverbs", tpl:"By {date}, {name} will expand utterances by including {expansionType} [prepositional phrases/ _ adjectives/adverbs etc] in spoken or written sentences independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","expansionType","prompts","correct","total","sessions","measure"] },
  { id:12, cat:"Grammar", sub:null, preview:"Use comparatives and superlatives accurately", tpl:"By {date}, {name} will use comparatives and superlatives accurately when producing complete sentences independently or with no more than {prompts} reminder(s) per task in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  // Narrative
  { id:13, cat:"Narrative", sub:null, preview:"Retell a story with key elements", tpl:"By {date}, {name} will retell a story including key elements (character, setting, problem, solution) independently or with visual supports only or no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:14, cat:"Narrative", sub:null, preview:"Sequence events using temporal language", tpl:"By {date}, {name} will sequence events using temporal language in {instances} instances per session independently or with no more than {prompts} prompt(s) across {sessions} sessions as measured by {measure}.", fields:["date","name","instances","prompts","sessions","measure"] },
  { id:15, cat:"Narrative", sub:null, preview:"Identify and explain problem and solution using a graphic organizer", tpl:"By {date}, {name} will identify and explain the problem and solution using a graphic organizer independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:16, cat:"Narrative", sub:null, preview:"Generate a story with required story elements", tpl:"By {date}, {name} will generate a story including at least {storyElements} story elements when provided with a graphic organizer independently or with visual supports only or no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","storyElements","prompts","correct","total","sessions","measure"] },
  { id:17, cat:"Narrative", sub:null, preview:"Identify characters' thoughts and feelings using text evidence", tpl:"By {date}, {name} will identify characters' thoughts and feelings using cues from the text as supporting evidence independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:18, cat:"Narrative", sub:null, preview:"Use causal and temporal language (because, so, then)", tpl:"By {date}, {name} will use causal and temporal language (because, so, then) at least {instances} times per session/when writing sentences independently or with no more than {prompts} prompt(s) across {sessions} sessions as measured by {measure}.", fields:["date","name","instances","prompts","sessions","measure"] },
  // Reading
  { id:19, cat:"Reading", sub:null, preview:"Use comprehension strategies during structured reading tasks", tpl:"By {date}, {name} will use comprehension strategies (predicting, questioning, summarizing) during structured reading tasks independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:20, cat:"Reading", sub:null, preview:"Answer factual comprehension questions correctly", tpl:"By {date}, {name} will answer factual comprehension questions correctly in {correct} out of {total} opportunities independently or with no more than {prompts} prompt(s) per question set when engaged in {activity} across {sessions} sessions as measured by {measure}.", fields:["date","name","correct","total","prompts","activity","sessions","measure"] },
  { id:21, cat:"Reading", sub:null, preview:"Answer inference questions using text evidence", tpl:"By {date}, {name} will answer inference questions using text evidence independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:22, cat:"Reading", sub:null, preview:"Identify main idea and supporting details", tpl:"By {date}, {name} will identify the main idea and supporting details independently or with visual supports only and/or no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:23, cat:"Reading", sub:null, preview:"Identify when text does not make sense and use a repair strategy", tpl:"By {date}, {name} will identify when a text does not make sense and use a strategy in {instances} instances per session independently or with no more than {prompts} prompt(s) across {sessions} sessions as measured by {measure}.", fields:["date","name","instances","prompts","sessions","measure"] },
  { id:24, cat:"Reading", sub:null, preview:"Summarize a passage using a structured framework", tpl:"By {date}, {name} will summarize a passage using a structured framework and a graphic organizer independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  // Writing
  { id:25, cat:"Writing", sub:null, preview:"Use a graphic organizer to plan writing", tpl:"By {date}, {name} will use a graphic organizer to plan writing independently or with visual supports only or no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:26, cat:"Writing", sub:null, preview:"Write a paragraph with topic sentence and supporting details", tpl:"By {date}, {name} will use a step-by-step written plan to write a paragraph including a topic sentence and at least {details} supporting details independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","details","prompts","correct","total","sessions","measure"] },
  { id:27, cat:"Writing", sub:null, preview:"Combine sentences to improve complexity", tpl:"By {date}, {name} will combine sentences to improve complexity in {instances} instances per task independently or with no more than {prompts} prompt(s) across {sessions} sessions as measured by {measure}.", fields:["date","name","instances","prompts","sessions","measure"] },
  { id:28, cat:"Writing", sub:null, preview:"Revise written work using a checklist", tpl:"By {date}, {name} will revise written work using a checklist independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:29, cat:"Writing", sub:null, preview:"Use transition words in writing tasks", tpl:"By {date}, {name} will use transition words at least {instances} times per writing task independently or with no more than {prompts} prompt(s) across {sessions} sessions as measured by {measure}.", fields:["date","name","instances","prompts","sessions","measure"] },
  { id:30, cat:"Writing", sub:null, preview:"Use self-monitoring strategies in writing", tpl:"By {date}, {name} will use self-monitoring strategies (e.g., re-reading, checking clarity) independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  // Executive Function
  { id:31, cat:"Executive Function", sub:"Planning and Organization", preview:"Use a checklist or plan to organize tasks", tpl:"By {date}, {name} will use a checklist or plan to organize tasks independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:32, cat:"Executive Function", sub:"Planning and Organization", preview:"Break down tasks into smaller steps", tpl:"By {date}, {name} will break down tasks into smaller steps independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:33, cat:"Executive Function", sub:"Planning and Organization", preview:"Organize ideas using a graphic organizer", tpl:"By {date}, {name} will organize ideas using a graphic organizer including all required components independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:34, cat:"Executive Function", sub:"Planning and Organization", preview:"Gather materials needed for tasks", tpl:"By {date}, {name} will gather materials needed for tasks independently or with no more than {prompts} reminder(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:35, cat:"Executive Function", sub:"Working Memory", preview:"Use visuals and checklists to follow multi-step directions", tpl:"By {date}, {name} will use strategies such as visuals, checklists etc to follow multi-step directions independently or with no more than {prompts} repetition(s) or prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:36, cat:"Executive Function", sub:"Working Memory", preview:"Use memory strategies (repeating, visualizing)", tpl:"By {date}, {name} will use memory strategies (e.g., repeating, visualizing) independently or with no more than {prompts} prompt(s) across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","sessions","measure"] },
  { id:37, cat:"Executive Function", sub:"Working Memory", preview:"Use strategies to complete tasks requiring recall", tpl:"By {date}, {name} will use strategies such as {strategy} to complete tasks requiring recall of information independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","strategy","prompts","correct","total","sessions","measure"] },
  { id:38, cat:"Executive Function", sub:"Self-Monitoring", preview:"Identify when they do not understand", tpl:"By {date}, {name} will identify when they do not understand {topic} in {instances} instances per session independently or with no more than {prompts} prompt(s) across {sessions} sessions as measured by {measure}.", fields:["date","name","topic","instances","prompts","sessions","measure"] },
  { id:39, cat:"Executive Function", sub:"Self-Monitoring", preview:"Use self-monitoring strategies", tpl:"By {date}, {name} will use self-monitoring strategies and will be rated as {rating} independently or with no more than {prompts} prompt(s) across {sessions} sessions as measured by {measure}.", fields:["date","name","rating","prompts","sessions","measure"] },
  { id:40, cat:"Executive Function", sub:"Self-Monitoring", preview:"Use a checklist to accurately review work", tpl:"By {date}, {name} will use a checklist to accurately review work independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:41, cat:"Executive Function", sub:"Self-Monitoring", preview:"Identify one strength and one area for improvement", tpl:"By {date}, {name} will identify one strength and one area for improvement independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:42, cat:"Executive Function", sub:"Cognitive Flexibility", preview:"Generate multiple solutions to a problem", tpl:"By {date}, {name} will generate at least {solutions} solutions to a problem independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","solutions","prompts","correct","total","sessions","measure"] },
  { id:43, cat:"Executive Function", sub:"Cognitive Flexibility", preview:"Adjust strategies when needed", tpl:"By {date}, {name} will adjust strategies when needed in {instances} instances per session independently or with no more than {prompts} prompt(s) across {sessions} sessions as measured by {measure}.", fields:["date","name","instances","prompts","sessions","measure"] },
  { id:44, cat:"Executive Function", sub:"Cognitive Flexibility", preview:"Use alternative strategies when tasks are challenging", tpl:"By {date}, {name} will use alternative strategies when tasks are challenging independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:45, cat:"Executive Function", sub:"Attention and Persistence", preview:"Demonstrate goal-directed persistence", tpl:"By {date}, {name} will demonstrate goal-directed persistence by continuing on when a task is challenging rather than giving up independently or with no more than {redirections} redirection(s) when engaged in structured language activities across {sessions} sessions as measured by {measure}.", fields:["date","name","redirections","sessions","measure"] },
  { id:46, cat:"Executive Function", sub:"Attention and Persistence", preview:"Return to a task after distraction", tpl:"By {date}, {name} will return to a task after distraction independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:47, cat:"Executive Function", sub:"Attention and Persistence", preview:"Complete all steps of a task without skipping", tpl:"By {date}, {name} will complete all steps of a task without skipping steps independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:48, cat:"Executive Function", sub:"Initiation and Self-Advocacy", preview:"Initiate tasks or request appropriate support", tpl:"By {date}, {name} will initiate tasks by starting independently or requesting an appropriate support (e.g. sentence stem, graphic organizer etc) within {time} seconds/minutes independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","time","prompts","correct","total","sessions","measure"] },
  { id:49, cat:"Executive Function", sub:"Initiation and Self-Advocacy", preview:"Self-advocate by sharing needs with a classmate or peer", tpl:"By {date}, {name} will self-advocate by sharing what they need with a classmate or peer (e.g. repetition, a visual support etc) independently or with no more than {prompts} prompt(s) in {correct} out of {total} opportunities across {sessions} sessions as measured by {measure}.", fields:["date","name","prompts","correct","total","sessions","measure"] },
  { id:50, cat:"Executive Function", sub:"Initiation and Self-Advocacy", preview:"Seek clarification by asking for rephrasing or other support", tpl:"By {date}, {name} will seek clarification by asking an adult/peer to rephrase the information or provide other forms of clarification in {instances} instances per session independently or with no more than {prompts} prompt(s) across {sessions} sessions as measured by {measure}.", fields:["date","name","instances","prompts","sessions","measure"] },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildGoalText(goal: Goal, values: Record<string, string>) {
  let t = goal.tpl;
  goal.fields.forEach((f) => {
    t = t.split(`{${f}}`).join(values[f] || `[${f}]`);
  });
  return t;
}

function buildGoalParts(goal: Goal, values: Record<string, string>) {
  const parts: React.ReactNode[] = [];
  let remaining = goal.tpl;
  let key = 0;
  goal.fields.forEach((f) => {
    const ph = `{${f}}`;
    const idx = remaining.indexOf(ph);
    if (idx === -1) return;
    if (idx > 0) parts.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
    const filled = values[f] || "";
    if (filled) {
      parts.push(<span key={key++}>{filled}</span>);
    } else {
      parts.push(<strong key={key++} className="font-bold text-deep-purple">[{f}]</strong>);
    }
    remaining = remaining.slice(idx + ph.length);
  });
  if (remaining) parts.push(<span key={key++}>{remaining}</span>);
  return parts;
}

// ─── GoalCard ─────────────────────────────────────────────────────────────────
function GoalCard({ goal, isOpen, onToggle, fieldValues, onFieldChange, locked }: {
  goal: Goal; isOpen: boolean; onToggle: () => void;
  fieldValues: Record<string, string>; onFieldChange: (f: string, v: string) => void;
  locked: boolean;
}) {
  const cfg = CAT_CONFIG[goal.cat];
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(buildGoalText(goal, fieldValues)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`bg-card border border-border rounded-xl mb-2 overflow-hidden ${locked ? "opacity-50 pointer-events-none select-none" : ""}`}>
      {/* Header */}
      <button
        onClick={locked ? undefined : onToggle}
        className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-left bg-muted/50 hover:bg-muted transition-colors"
      >
        <div className={`w-6 h-6 rounded-full ${cfg.numBg} flex items-center justify-center flex-shrink-0`}>
          <span className="text-[10px] font-semibold text-white">{goal.id}</span>
        </div>
        <span className="text-sm text-foreground flex-1 truncate">{goal.preview}</span>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text} border ${cfg.border} flex-shrink-0`}>
          {goal.cat === "Grammar" ? "Grammar" : goal.cat === "Reading" ? "Reading" : goal.cat === "Narrative" ? "Narrative" : goal.cat}
        </span>
        {locked ? (
          <Lock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        ) : isOpen ? (
          <ChevronUp className="h-3.5 w-3.5 text-deep-purple flex-shrink-0" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-deep-purple flex-shrink-0" />
        )}
      </button>

      {/* Expanded body */}
      {isOpen && !locked && (
        <div className="px-3.5 py-3.5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
            {goal.fields.map((f) => (
              <div key={f}>
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  {FIELD_LABELS[f] || f}
                </label>
                <Input
                  placeholder={FIELD_LABELS[f] || f}
                  value={fieldValues[f] || ""}
                  onChange={(e) => onFieldChange(f, e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </div>

          {/* Live preview */}
          <div className="bg-thistle/20 border border-thistle/40 rounded-lg p-3 text-sm leading-relaxed text-deep-purple mb-3">
            {buildGoalParts(goal, fieldValues)}
          </div>

          {/* Copy button */}
          <Button
            size="sm"
            onClick={handleCopy}
            className={`${copied ? "bg-emerald-600 hover:bg-emerald-700" : "bg-deep-purple hover:bg-deep-purple/90"} text-white`}
          >
            {copied ? <><Check className="h-3.5 w-3.5 mr-1" /> Copied!</> : <><Copy className="h-3.5 w-3.5 mr-1" /> Copy goal</>}
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
const IEPGoalBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { purchasedResourceIds, loading } = usePurchases(user?.id);
  const hasPurchased = purchasedResourceIds.has(IEP_RESOURCE_ID);

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [openCards, setOpenCards] = useState<Record<number, boolean>>({});
  const [allFieldValues, setAllFieldValues] = useState<Record<number, Record<string, string>>>({});

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return GOALS.filter((g) => {
      const matchQ = !q || g.preview.toLowerCase().includes(q) || g.cat.toLowerCase().includes(q) || (g.sub && g.sub.toLowerCase().includes(q));
      const matchC = !catFilter || g.cat === catFilter;
      return matchQ && matchC;
    });
  }, [search, catFilter]);

  const grouped = useMemo(() => {
    const result: Array<{ type: "cat"; cat: string } | { type: "sub"; label: string } | { type: "goal"; goal: Goal; index: number }> = [];
    let lastCat: string | null = null;
    let lastSub: string | null = null;
    let idx = 0;
    filtered.forEach((g) => {
      if (g.cat !== lastCat) { result.push({ type: "cat", cat: g.cat }); lastCat = g.cat; lastSub = null; }
      if (g.sub && g.sub !== lastSub) { result.push({ type: "sub", label: g.sub }); lastSub = g.sub; }
      result.push({ type: "goal", goal: g, index: idx++ });
    });
    return result;
  }, [filtered]);

  if (loading) {
    return <HubLayout><div className="max-w-4xl mx-auto px-4 py-12 text-center text-muted-foreground">Loading...</div></HubLayout>;
  }

  return (
    <HubLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <button onClick={() => navigate("/hub")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to Resource Library
        </button>

        {/* Header */}
        <div className="bg-deep-purple rounded-xl p-5 mb-4">
          <h1 className="text-xl font-semibold text-white mb-1">IEP Goal Builder — DLD Edition</h1>
          <p className="text-sm text-thistle">Empowered DLD · 50 goals across 6 domains · Fill in the fields, copy your goal</p>
        </div>

        {/* Disclaimer */}
        <div className="bg-muted border border-thistle/40 rounded-lg px-3.5 py-2.5 text-xs text-muted-foreground mb-4">
          <strong>Note:</strong> These goals are to get you started. Please personalize them for your individual students.
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search goals..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All domains</option>
            <option value="Vocabulary">Vocabulary</option>
            <option value="Grammar">Grammar &amp; Sentence Structure</option>
            <option value="Narrative">Narrative Language</option>
            <option value="Reading">Reading Comprehension</option>
            <option value="Writing">Writing</option>
            <option value="Executive Function">Executive Function</option>
          </select>
        </div>

        <p className="text-xs text-muted-foreground mb-3">Showing {filtered.length} of {GOALS.length} goals</p>

        {/* Unlock CTA for non-purchasers */}
        {!hasPurchased && (
          <div className="bg-thistle/20 border border-thistle/50 rounded-xl p-5 mb-6 text-center">
            <Lock className="h-8 w-8 text-deep-purple mx-auto mb-2" />
            <h2 className="text-lg font-semibold text-foreground mb-1">Preview Mode</h2>
            <p className="text-sm text-muted-foreground mb-3">
              You can preview the first {PREVIEW_LIMIT} goals. Unlock all 50 goals by purchasing the IEP Goal Builder Bundle.
            </p>
            <Button onClick={() => navigate(`/hub/resource/${IEP_RESOURCE_ID}`)} className="bg-deep-purple text-white hover:bg-deep-purple/90">
              <Lock className="h-4 w-4 mr-2" /> Unlock All Goals
            </Button>
          </div>
        )}

        {/* Goal list */}
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">No goals match your search.</div>
        ) : (
          grouped.map((item, idx) => {
            if (item.type === "cat") {
              return (
                <div key={`cat-${item.cat}-${idx}`} className="text-sm font-semibold text-foreground pt-4 pb-1.5 border-b border-border mb-2">
                  {CAT_LABELS[item.cat]}
                </div>
              );
            }
            if (item.type === "sub") {
              return (
                <div key={`sub-${item.label}-${idx}`} className="text-[11px] font-semibold text-deep-purple uppercase tracking-wider pt-2.5 pb-1.5 border-b border-thistle/40 mb-2">
                  {item.label}
                </div>
              );
            }
            const g = item.goal;
            const isLocked = !hasPurchased && item.index >= PREVIEW_LIMIT;
            return (
              <GoalCard
                key={g.id}
                goal={g}
                isOpen={!!openCards[g.id]}
                onToggle={() => setOpenCards((prev) => ({ ...prev, [g.id]: !prev[g.id] }))}
                fieldValues={allFieldValues[g.id] || {}}
                onFieldChange={(field, value) => setAllFieldValues((prev) => ({ ...prev, [g.id]: { ...(prev[g.id] || {}), [field]: value } }))}
                locked={isLocked}
              />
            );
          })
        )}
      </div>
    </HubLayout>
  );
};

export default IEPGoalBuilder;
