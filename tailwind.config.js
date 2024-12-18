/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        lora: ["Lora", "serif"],
        lato: ["Lato", "sans-serif"],
      },
      colors: {
        main: "#5b7898",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "dark-slate": {
          gradient: "from-slate-400 to-slate-700",
          background: "#3a3b40",
          cardBackground: "#4a4b50",
          textPrimary: "#ffffff",
          textSecondary: "#d1d5db",
        },
        "ocean-breeze": {
          gradient: "from-blue-400 to-cyan-600",
          background: "#2c8db3",
          cardBackground: "#3aa0d4",
          textPrimary: "#ffffff",
          textSecondary: "#dbf0ff",
        },
        "forest-green": {
          gradient: "from-green-600 to-emerald-800",
          background: "#2d7a3d",
          cardBackground: "#3a9e4e",
          textPrimary: "#ffffff",
          textSecondary: "#bbf7d0",
        },
        "sunset-orange": {
          gradient: "from-orange-400 to-red-600",
          background: "#e65c23",
          cardBackground: "#ff6b35",
          textPrimary: "#ffffff",
          textSecondary: "#ffedd5",
        },
        "royal-purple": {
          gradient: "from-purple-600 to-indigo-800",
          background: "#6a1b9a",
          cardBackground: "#8e24aa",
          textPrimary: "#ffffff",
          textSecondary: "#e9d5ff",
        },
        "midnight-blue": {
          gradient: "from-blue-900 to-black",
          background: "#121b2d",
          cardBackground: "#1e2d4a",
          textPrimary: "#ffffff",
          textSecondary: "#bfdbfe",
        },
      },
      animation: {
        marquee: "marquee var(--marquee-duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--marquee-duration) linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        marquee: {
          "100%": {
            transform: "translateX(-50%)",
          },
        },
        "marquee-vertical": {
          "100%": {
            transform: "translateY(-50%)",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
