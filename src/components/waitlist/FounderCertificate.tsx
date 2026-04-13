import React, { useRef } from "react";
import { motion } from "motion/react";
import { Download } from "lucide-react";
import { toast } from "sonner";

export interface FounderCertificateProps {
  userName: string;
  tierName: string;
  date: string;
  onDownload?: () => void;
}

export default function FounderCertificate({
  userName,
  tierName,
  date,
  onDownload,
}: FounderCertificateProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleDownload = async () => {
    if (!svgRef.current) {
      toast.error("Certificate not ready");
      return;
    }

    try {
      // Create canvas from SVG
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        toast.error("Failed to create certificate");
        return;
      }

      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `Founding-Supporter-Certificate-${userName.replace(/\s+/g, "-")}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Certificate downloaded!");

        if (onDownload) {
          onDownload();
        }
      };

      img.onerror = () => {
        toast.error("Failed to generate certificate image");
      };

      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download certificate");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Certificate SVG */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-4xl"
      >
        <svg
          ref={svgRef}
          viewBox="0 0 1200 800"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto border-2 border-[#8861d4]/20 rounded-lg shadow-lg bg-white"
        >
          {/* Background pattern */}
          <defs>
            <linearGradient id="cert-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#F5F3F8", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#FAF8FC", stopOpacity: 1 }} />
            </linearGradient>
            <pattern id="dots" x="40" y="40" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="1.5" fill="#8861d4" opacity="0.1" />
            </pattern>
          </defs>

          {/* Background */}
          <rect width="1200" height="800" fill="url(#cert-gradient)" />
          <rect width="1200" height="800" fill="url(#dots)" />

          {/* Ornamental border */}
          <rect
            x="40"
            y="40"
            width="1120"
            height="720"
            fill="none"
            stroke="#8861d4"
            strokeWidth="3"
            opacity="0.6"
            rx="12"
          />

          {/* Gold accent lines */}
          <rect
            x="60"
            y="60"
            width="1080"
            height="680"
            fill="none"
            stroke="#D4920B"
            strokeWidth="1.5"
            opacity="0.4"
            rx="10"
          />

          {/* Decorative corner elements */}
          {/* Top left corner */}
          <circle cx="70" cy="70" r="8" fill="#D4920B" opacity="0.3" />
          {/* Top right corner */}
          <circle cx="1130" cy="70" r="8" fill="#D4920B" opacity="0.3" />
          {/* Bottom left corner */}
          <circle cx="70" cy="730" r="8" fill="#D4920B" opacity="0.3" />
          {/* Bottom right corner */}
          <circle cx="1130" cy="730" r="8" fill="#D4920B" opacity="0.3" />

          {/* Main title */}
          <text
            x="600"
            y="120"
            fontFamily="Georgia, serif"
            fontSize="64"
            fontWeight="bold"
            textAnchor="middle"
            fill="#3b1f59"
            letterSpacing="2"
          >
            FOUNDING SUPPORTER
          </text>

          <text
            x="600"
            y="185"
            fontFamily="Georgia, serif"
            fontSize="48"
            fontWeight="normal"
            textAnchor="middle"
            fill="#8861d4"
            letterSpacing="1"
          >
            CERTIFICATE
          </text>

          {/* Decorative line */}
          <line
            x1="150"
            y1="220"
            x2="1050"
            y2="220"
            stroke="#D4920B"
            strokeWidth="2"
            opacity="0.5"
          />

          {/* Certification text */}
          <text
            x="600"
            y="280"
            fontFamily="Arial, sans-serif"
            fontSize="20"
            fontWeight="500"
            textAnchor="middle"
            fill="#3b1f59"
          >
            This certifies that
          </text>

          {/* User name (emphasized) */}
          <text
            x="600"
            y="350"
            fontFamily="Georgia, serif"
            fontSize="52"
            fontWeight="bold"
            textAnchor="middle"
            fill="#8861d4"
            letterSpacing="1"
          >
            {userName}
          </text>

          {/* Description text */}
          <text
            x="600"
            y="410"
            fontFamily="Arial, sans-serif"
            fontSize="18"
            fontWeight="400"
            textAnchor="middle"
            fill="#3b1f59"
          >
            is a founding supporter of Story Pros
          </text>

          <text
            x="600"
            y="445"
            fontFamily="Arial, sans-serif"
            fontSize="18"
            fontWeight="400"
            textAnchor="middle"
            fill="#3b1f59"
          >
            and a valued member of the {tierName} tier
          </text>

          {/* Awarded date */}
          <text
            x="600"
            y="520"
            fontFamily="Arial, sans-serif"
            fontSize="16"
            fontWeight="400"
            textAnchor="middle"
            fill="#555555"
          >
            Awarded on {date}
          </text>

          {/* Decorative line before footer */}
          <line
            x1="150"
            y1="560"
            x2="1050"
            y2="560"
            stroke="#D4920B"
            strokeWidth="1.5"
            opacity="0.4"
          />

          {/* Footer branding */}
          <text
            x="600"
            y="630"
            fontFamily="Arial, sans-serif"
            fontSize="32"
            fontWeight="700"
            textAnchor="middle"
            fill="#8861d4"
          >
            Story Pros
          </text>

          <text
            x="600"
            y="670"
            fontFamily="Arial, sans-serif"
            fontSize="14"
            fontWeight="400"
            textAnchor="middle"
            fill="#666666"
          >
            Empowered DLD • Storytelling for Children with Developmental Language Disorder
          </text>

          {/* Certificate seal element (bottom right) */}
          <circle cx="1080" cy="720" r="35" fill="#D4920B" opacity="0.15" />
          <circle cx="1080" cy="720" r="30" fill="none" stroke="#D4920B" strokeWidth="2" opacity="0.4" />
          <text
            x="1080"
            y="730"
            fontFamily="Arial, sans-serif"
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
            fill="#D4920B"
            opacity="0.6"
          >
            ★
          </text>

          {/* Valid marker (bottom left) */}
          <text
            x="120"
            y="755"
            fontFamily="Arial, sans-serif"
            fontSize="12"
            fontWeight="400"
            fill="#999999"
            opacity="0.7"
          >
            Certificate ID: {userName.toUpperCase().slice(0, 3)}-{Date.now().toString().slice(-4)}
          </text>
        </svg>
      </motion.div>

      {/* Download button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownload}
        className="flex items-center gap-2 px-8 py-3 bg-[#8861d4] hover:bg-[#7451c4] text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <Download className="w-5 h-5" />
        Download Certificate
      </motion.button>

      {/* Description text */}
      <p className="text-center text-gray-600 text-sm max-w-2xl">
        Your Founding Supporter Certificate celebrates your commitment to bringing Story Pros to life.
        Share this certificate to show your support for accessible storytelling for children with DLD.
      </p>
    </div>
  );
}
