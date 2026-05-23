"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendColdEmailsAction } from "@/lib/actions/lead.actions";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

type EmailDialogProps = {
  selectedLeads: Array<{
    _id: string;
    name: string;
    email: string;
    company?: string;
  }>;
  onSuccess: () => void;
  onClose: () => void;
};

const TEMPLATES = [
  {
    id: "service_offer",
    name: "💼 High-Performance Dev Offer",
    subject: "Custom Web Development for {{company}}",
    format: "plain" as const,
    body: `Hi {{name}},

I hope this email finds you well.

I'm reaching out from ArtistyCode Studio. We specialize in building ultra-fast, performance-focused custom web applications using the MERN stack (MongoDB, Express, React, Node.js) and Next.js. 

We help businesses like {{company}} establish a powerful web presence with clean code, modern designs, and lightning-fast page speeds.

Our custom development rates start at just $300, and we offer robust ongoing maintenance and support packages starting at $50/month. Whether you need a brand-new platform, an interactive customer portal, or a landing page that converts, we deliver top-tier results without corporate agency overhead.

Would you be open to a quick, 10-minute call this week to talk about your product goals? 

Best regards,
Team ArtistyCode Studio`
  },
  {
    id: "tech_migration",
    name: "🚀 Migrate to Next.js (Modernization)",
    subject: "Modernizing {{company}}'s Web Stack",
    format: "plain" as const,
    body: `Hi {{name}},

I visited {{company}}'s website recently and wanted to reach out regarding your current technical setup.

As web standards evolve, page load speed, SEO performance, and core web vitals are increasingly critical for ranking and user retention. Legacy systems often hold businesses back. 

At ArtistyCode Studio, we specialize in migrating existing setups to modern architectures like Next.js and Headless MERN stacks. This transition typically boosts speed by 60%+, enhances security, and dramatically improves Google SEO rankings.

We can handle the entire migration process with zero downtime, starting at $300 for development and $50/month for active security and performance maintenance.

Are you available for a short introductory call to discuss how modernizing your stack could benefit {{company}}?

Best regards,
Team ArtistyCode Studio`
  },
  {
    id: "agency_partnership",
    name: "🤝 Reliable Agency Partner",
    subject: "Reliable Dev Subcontracting for {{company}}",
    format: "plain" as const,
    body: `Hi {{name}},

If {{company}} ever runs into bandwidth bottlenecks or needs a trusted development partner to build high-performance web products, we would love to connect.

At ArtistyCode Studio, we act as a reliable, white-label technical partner for design studios and marketing agencies. We build responsive, pixel-perfect web applications using React, Next.js, and the MERN stack.

Our flexible pricing starts at just $300 for standalone projects and $50/month for comprehensive maintenance, allowing you to scale your team's output risk-free while maintaining healthy profit margins.

Let me know if you would be open to a brief call to see how we can support your upcoming client pipelines.

Best regards,
Team ArtistyCode Studio`
  },
  {
    id: "reengagement",
    name: "🎟️ Limited-Time Discount",
    subject: "Exclusive offer for {{company}} - Custom builds",
    format: "plain" as const,
    body: `Hi {{name}},

I'm writing to share a limited-time opportunity with the team at {{company}}.

We currently have two project openings at ArtistyCode Studio for next month. To fill these spots, we are offering our premium React/Next.js/MERN development packages starting at a promotional rate of $300, backed by ongoing maintenance at just $50/month.

If you've been considering launching a new web portal, modernizing your mobile experience, or building a bespoke internal tool, this is the perfect window to get corporate-level quality at startup pricing.

This rate is only available for bookings confirmed this month. Let me know if you'd like to schedule a quick call to map out your project details.

Best regards,
Team ArtistyCode Studio`
  },
  {
    id: "intro",
    name: "👋 Introduction & Partnership",
    subject: "Collaborating with {{company}}",
    format: "plain" as const,
    body: `Hi {{name}},

I hope you are having a wonderful week.

I've been following the updates from {{company}} and am really impressed by what you are building. At ArtistyCode Studio, we partner with companies to design, build, and optimize custom web applications, mobile apps, and high-performance digital tools.

I wanted to reach out and see if there are any technical roadblocks or design needs your team is facing this quarter where a specialized agency could accelerate your development.

Would you be open to a brief 10-minute chat next Tuesday or Wednesday to see if there's a good fit?

Best regards,
Team ArtistyCode Studio`
  },
  {
    id: "audit",
    name: "⚡ Free UX & Tech Audit",
    subject: "UX & Performance Audit for {{company}}",
    format: "plain" as const,
    body: `Hi {{name}},

I'm reaching out with a special proposal for {{company}}.

Our engineering team at ArtistyCode Studio is offering a complimentary UX & Performance audit for your primary digital assets this month. We look at load speeds, responsiveness, accessibility, and checkout flow friction to give you actionable insights.

There is no obligation or cost. We are simply showcasing our expertise in building high-conversion, modern web products.

If this sounds interesting, please let me know and we will get started!

Best,
ArtistyCode Studio Team`
  },
  {
    id: "followup",
    name: "📬 Quick Follow Up",
    subject: "Quick follow up - {{company}} digital project",
    format: "plain" as const,
    body: `Hi {{name}},

I know you are super busy running things at {{company}}, so I'll keep this short.

I sent over an email last week about how ArtistyCode Studio helps companies build premium, fast React/Next.js platforms and mobile apps.

Are you open to a brief call next week to introduce ourselves, or should I follow up later in the year?

Thanks,
Team ArtistyCode Studio`
  },
  {
    id: "custom",
    name: "✍️ Write from Scratch",
    subject: "Message for {{name}}",
    format: "plain" as const,
    body: `Hi {{name}},

[Write your message here]

Best,
[Your Name]`
  }
];

const EmailDialog = ({ selectedLeads, onSuccess, onClose }: EmailDialogProps) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATES[0].id);
  const [subject, setSubject] = useState(TEMPLATES[0].subject);
  const [body, setBody] = useState(TEMPLATES[0].body);
  const [format, setFormat] = useState<"plain" | "html">(TEMPLATES[0].format);
  
  const [isSending, setIsSending] = useState(false);
  const [previewLead, setPreviewLead] = useState<any>(null);
  
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (selectedLeads.length > 0) {
      setPreviewLead(selectedLeads[0]);
    } else {
      setPreviewLead({
        name: "John Doe",
        company: "Acme Corp",
        email: "john@example.com",
      });
    }
  }, [selectedLeads]);

  const handleTemplateChange = (templateId: string) => {
    const tpl = TEMPLATES.find((t) => t.id === templateId);
    if (tpl) {
      setSelectedTemplateId(templateId);
      setSubject(tpl.subject);
      setBody(tpl.body);
      setFormat(tpl.format);
    }
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error("Subject and Body are required.");
      return;
    }

    try {
      setIsSending(true);
      const leadIds = selectedLeads.map((l) => l._id);
      
      const bodyToSend = format === "plain"
        ? `
          <div style="background-color: #f9f9f9; padding: 30px 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; min-height: 100%;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <div style="margin-bottom: 24px; text-align: center; border-bottom: 1px solid #f3f4f6; padding-bottom: 16px;">
                <h2 style="color: #0f172a; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.025em;">ArtistyCode Studio</h2>
              </div>
              <div style="color: #334155; font-size: 15px; line-height: 1.6; white-space: pre-wrap; word-break: break-word;">${body}</div>
              <div style="margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
                <p style="margin: 0 0 4px;">&copy; ${new Date().getFullYear()} ArtistyCode Studio. All rights reserved.</p>
                <a href="https://artistycode.studio" style="color: #3b82f6; text-decoration: none; font-weight: 500;">www.artistycode.studio</a>
              </div>
            </div>
          </div>
        `
        : body;

      const res = await sendColdEmailsAction({
        leadIds,
        subject,
        bodyTemplate: bodyToSend,
      });

      if (res && res.successCount > 0) {
        toast.success(`Successfully sent ${res.successCount} email(s)!`);
        if (res.failureCount > 0) {
          toast.error(`Failed to send ${res.failureCount} email(s).`);
        }
        onSuccess();
        onClose();
      } else {
        toast.error("Failed to send emails. Check your configuration.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to send emails");
    } finally {
      setIsSending(false);
    }
  };

  const getPreview = (template: string) => {
    if (!previewLead) return template;
    return template
      .replace(/\{\{name\}\}/gi, previewLead.name)
      .replace(/\{\{company\}\}/gi, previewLead.company || "[Company Name]");
  };

  const getFullHtmlPreview = () => {
    const personalizedBody = getPreview(body);
    if (format === "plain") {
      return `
        <div style="background-color: #f9f9f9; padding: 30px 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; border-radius: 8px;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
            <div style="margin-bottom: 24px; text-align: center; border-bottom: 1px solid #f3f4f6; padding-bottom: 16px;">
              <h2 style="color: #0f172a; margin: 0; font-size: 20px; font-weight: 700;">ArtistyCode Studio</h2>
            </div>
            <div style="color: #334155; font-size: 15px; line-height: 1.6; white-space: pre-wrap; word-break: break-word;">${personalizedBody}</div>
            <div style="margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
              <p style="margin: 0 0 4px;">&copy; ${new Date().getFullYear()} ArtistyCode Studio. All rights reserved.</p>
              <a href="https://artistycode.studio" style="color: #3b82f6; text-decoration: none; font-weight: 500;">www.artistycode.studio</a>
            </div>
          </div>
        </div>
      `;
    }
    return `<div style="padding: 10px; word-break: break-word;">${personalizedBody}</div>`;
  };

  const insertTag = (tag: string, field: "subject" | "body") => {
    if (field === "subject") {
      setSubject((prev) => prev + " " + tag);
    } else {
      const textarea = bodyRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const after = text.substring(end, text.length);
        setBody(before + tag + after);
        
        // Put cursor after the tag
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + tag.length, start + tag.length);
        }, 0);
      } else {
        setBody((prev) => prev + tag);
      }
    }
  };

  return (
    <div className="space-y-4 text-white">
      <div>
        <p className="text-sm text-white/60 mb-1">Recipients ({selectedLeads.length})</p>
        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto border border-white/10 p-2 rounded-lg bg-white/5">
          {selectedLeads.map((l) => (
            <span key={l._id} className="text-xs bg-white/10 text-white/80 px-2 py-0.5 rounded-full">
              {l.name} ({l.email})
            </span>
          ))}
        </div>
      </div>

      {/* Template & Format Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-white/80">Choose Template</label>
          <select
            value={selectedTemplateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full rounded-md border border-white/20 bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-white/80">Email Editor Format</label>
          <div className="flex gap-2 p-1 border border-white/10 rounded-md bg-white/5 h-10">
            <button
              onClick={() => setFormat("plain")}
              className={`flex-1 text-xs rounded transition-all font-semibold ${
                format === "plain" ? "bg-white text-black" : "hover:bg-white/10 text-white"
              }`}
            >
              Plain Text (Auto-Layout)
            </button>
            <button
              onClick={() => setFormat("html")}
              className={`flex-1 text-xs rounded transition-all font-semibold ${
                format === "html" ? "bg-white text-black" : "hover:bg-white/10 text-white"
              }`}
            >
              Custom HTML Code
            </button>
          </div>
        </div>
      </div>

      {/* Merge Tags Helper */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-white/60">Insert merge tags:</span>
        <button
          onClick={() => insertTag("{{name}}", "body")}
          className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded transition-all"
        >
          {"{{name}} (Name)"}
        </button>
        <button
          onClick={() => insertTag("{{company}}", "body")}
          className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded transition-all"
        >
          {"{{company}} (Company)"}
        </button>
      </div>

      {/* Subject */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-white/80">Subject Line</label>
        <div className="flex gap-2">
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="bg-black border-white/20 text-white flex-1"
          />
          <button
            onClick={() => insertTag("{{company}}", "subject")}
            className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded transition h-10 flex items-center justify-center border border-white/10 font-semibold"
          >
            + Company
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-white/80">
          Email Body {format === "plain" ? "(Auto-wrapped in premium template)" : "(HTML supported)"}
        </label>
        <Textarea
          ref={bodyRef}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={
            format === "plain"
              ? "Type your email message. Use {{name}} or {{company}} to personalize..."
              : "Type HTML code..."
          }
          className={`bg-black border-white/20 text-white min-h-[160px] text-sm ${
            format === "html" ? "font-mono text-xs" : ""
          }`}
        />
      </div>

      {/* Real-time Preview */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-white/80">Live Preview (First Recipient)</label>
        <div className="border border-white/10 rounded-lg p-3 bg-white text-black min-h-[140px] text-sm overflow-y-auto max-h-56">
          <div className="font-semibold border-b border-gray-200 pb-2 mb-2 text-gray-900">
            Subject: {getPreview(subject)}
          </div>
          <div dangerouslySetInnerHTML={{ __html: getFullHtmlPreview() }} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onClose} disabled={isSending}>
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          disabled={isSending || selectedLeads.length === 0}
          className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Emails"
          )}
        </Button>
      </div>
    </div>
  );
};

export default EmailDialog;
