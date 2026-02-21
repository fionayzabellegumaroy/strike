import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Svg, { Ellipse, Path, Circle, Defs, RadialGradient, Stop } from "react-native-svg";

const { width, height } = Dimensions.get("window");

// ── Watercolor blob background painted in SVG ──────────────────────────────
function WatercolorBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <RadialGradient id="sky" cx="50%" cy="0%" r="80%">
            <Stop offset="0%" stopColor="#D6EAF0" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#F5EDE3" stopOpacity="0.4" />
          </RadialGradient>
          <RadialGradient id="blob1" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#A8C5B0" stopOpacity="0.45" />
            <Stop offset="100%" stopColor="#A8C5B0" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="blob2" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#E8B8A0" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#E8B8A0" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="blob3" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#B8C8E0" stopOpacity="0.38" />
            <Stop offset="100%" stopColor="#B8C8E0" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="blob4" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#D4B8D0" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#D4B8D0" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Sky wash */}
        <Ellipse cx={width / 2} cy={-20} rx={width * 0.9} ry={height * 0.55} fill="url(#sky)" />

        {/* Sage green blob top-left */}
        <Ellipse cx={-40} cy={height * 0.18} rx={220} ry={200} fill="url(#blob1)" />

        {/* Peach blob right */}
        <Ellipse cx={width + 30} cy={height * 0.35} rx={260} ry={220} fill="url(#blob2)" />

        {/* Dusty blue blob bottom */}
        <Ellipse cx={width * 0.3} cy={height * 0.82} rx={240} ry={190} fill="url(#blob3)" />

        {/* Lavender mist bottom-right */}
        <Ellipse cx={width * 0.9} cy={height * 0.75} rx={210} ry={180} fill="url(#blob4)" />

        {/* Soft grass hills at bottom — painterly strokes */}
        <Path
          d={`M0 ${height * 0.88} Q${width * 0.25} ${height * 0.78} ${width * 0.5} ${height * 0.84} Q${width * 0.75} ${height * 0.9} ${width} ${height * 0.8} L${width} ${height} L0 ${height} Z`}
          fill="#B8D4B0"
          opacity={0.28}
        />
        <Path
          d={`M0 ${height * 0.93} Q${width * 0.3} ${height * 0.87} ${width * 0.6} ${height * 0.91} Q${width * 0.8} ${height * 0.94} ${width} ${height * 0.88} L${width} ${height} L0 ${height} Z`}
          fill="#9EC49A"
          opacity={0.22}
        />

        {/* Tiny floating spores / soot sprites ✦ */}
        {[[width*0.15, height*0.22], [width*0.78, height*0.3], [width*0.55, height*0.15], [width*0.88, height*0.55], [width*0.08, height*0.6]].map(([cx, cy], i) => (
          <Circle key={i} cx={cx} cy={cy} r={3 + (i % 3)} fill="#C4A882" opacity={0.35 + i*0.04} />
        ))}
      </Svg>
    </View>
  );
}

// ── Totoro-ish acorn deco icon ──────────────────────────────────────────────
function AcornIcon() {
  return (
    <Svg width={64} height={72} viewBox="0 0 64 72">
      {/* cap */}
      <Ellipse cx={32} cy={22} rx={26} ry={14} fill="#7A9E7E" opacity={0.85} />
      <Ellipse cx={32} cy={20} rx={22} ry={10} fill="#8FB890" opacity={0.7} />
      {/* stem */}
      <Path d="M32 20 Q36 10 40 6" stroke="#7A9E7E" strokeWidth={2.5} strokeLinecap="round" fill="none" opacity={0.8} />
      {/* body */}
      <Ellipse cx={32} cy={46} rx={20} ry={24} fill="#D4A574" opacity={0.9} />
      <Ellipse cx={32} cy={46} rx={20} ry={24} fill="#C49060" opacity={0.3} />
      {/* shine */}
      <Ellipse cx={25} cy={38} rx={5} ry={7} fill="white" opacity={0.2} />
    </Svg>
  );
}

// ── Main Landing Screen ─────────────────────────────────────────────────────
export default function LandingPage({ navigation }) {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <WatercolorBackground />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── Header wordmark ── */}
        <View style={styles.wordmarkRow}>
          <Text style={styles.wordmark}>strike</Text>
          <View style={styles.dotAccent} />
        </View>

        {/* ── Hero illustration area ── */}
        <View style={styles.heroArea}>
          <AcornIcon />
          {/* Painterly tagline badge */}
          <View style={styles.taglineBadge}>
            <Text style={styles.taglineText}>who is free tonight?</Text>
          </View>
        </View>

        {/* ── Main headline ── */}
        <View style={styles.headlineBlock}>
          <Text style={styles.headline}>Find your{"\n"}people,{" "}
            <Text style={styles.headlineAccent}>right now.</Text>
          </Text>
          <Text style={styles.subline}>
            Real hangouts with verified students{"\n"}near you — no feeds, just plans.
          </Text>
        </View>

        {/* ── Verification note ── */}
        <View style={styles.verifyRow}>
          <Text style={styles.verifyIcon}>🎓</Text>
          <Text style={styles.verifyText}>College students only · .edu verified</Text>
        </View>

        {/* ── CTA Buttons ── */}
        {!showLogin ? (
          <View style={styles.ctaBlock}>
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.82}
              onPress={() => {/* navigate to onboarding */}}
            >
              <Text style={styles.primaryBtnText}>⚡  I am down to hang</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              activeOpacity={0.7}
              onPress={() => setShowLogin(true)}
            >
              <Text style={styles.secondaryBtnText}>Log in</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ── Login form ── */
          <View style={styles.loginCard}>
            <Text style={styles.loginTitle}>Welcome back ✦</Text>

            <Text style={styles.inputLabel}>College email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@university.edu"
              placeholderTextColor="#B0A898"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#B0A898"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.82}>
              <Text style={styles.primaryBtnText}>Log in →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowLogin(false)}
            >
              <Text style={styles.cancelBtnText}>← Back</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>✦ safe · local · spontaneous ✦</Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F2EBE0",   // warm parchment — Ghibli paper tone
  },
  scroll: {
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 48,
    alignItems: "center",
    minHeight: height,
  },

  // ── Wordmark
  wordmarkRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 32,
    gap: 6,
  },
  wordmark: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 32,
    fontWeight: "700",
    color: "#4A6741",        // muted Ghibli forest green
    letterSpacing: -0.5,
    fontStyle: "italic",
  },
  dotAccent: {
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: "#D4856A",  // warm clay
    marginTop: 6,
  },

  // ── Hero
  heroArea: {
    alignItems: "center",
    marginBottom: 24,
    gap: 14,
  },
  taglineBadge: {
    backgroundColor: "rgba(168, 197, 176, 0.35)",
    borderWidth: 1.5,
    borderColor: "#A8C5B0",
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  taglineText: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontStyle: "italic",
    fontSize: 15,
    color: "#4A6741",
    letterSpacing: 0.3,
  },

  // ── Headline
  headlineBlock: {
    alignItems: "center",
    marginBottom: 20,
  },
  headline: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 42,
    fontWeight: "700",
    color: "#2E3A28",
    textAlign: "center",
    lineHeight: 52,
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  headlineAccent: {
    color: "#C47A55",       // warm terracotta — Ghibli sunset
    fontStyle: "italic",
  },
  subline: {
    fontFamily: Platform.select({ ios: "Palatino", android: "serif", default: "Palatino, serif" }),
    fontSize: 16,
    color: "#7A6E64",
    textAlign: "center",
    lineHeight: 24,
    letterSpacing: 0.1,
  },

  // ── Verify
  verifyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(212, 197, 176, 0.3)",
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 36,
    borderWidth: 1,
    borderColor: "rgba(180, 160, 130, 0.35)",
  },
  verifyIcon: { fontSize: 16 },
  verifyText: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 13,
    color: "#6B5E52",
    fontWeight: "600",
    letterSpacing: 0.2,
  },

  // ── CTA
  ctaBlock: {
    width: "100%",
    gap: 14,
  },
  primaryBtn: {
    width: "100%",
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: "#4A6741",   // Ghibli forest green
    alignItems: "center",
    shadowColor: "#4A6741",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  },
  primaryBtnText: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 17,
    fontWeight: "700",
    color: "#F5EDE3",
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: "transparent",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#A8C5B0",
  },
  secondaryBtnText: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 16,
    fontWeight: "600",
    color: "#4A6741",
    letterSpacing: 0.2,
  },

  // ── Login card
  loginCard: {
    width: "100%",
    backgroundColor: "rgba(245, 237, 227, 0.88)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: "rgba(168, 197, 176, 0.5)",
    shadowColor: "#A8C5B0",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 4,
    gap: 10,
  },
  loginTitle: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 22,
    fontWeight: "700",
    color: "#2E3A28",
    fontStyle: "italic",
    marginBottom: 6,
    textAlign: "center",
  },
  inputLabel: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 13,
    color: "#7A6E64",
    fontWeight: "600",
    letterSpacing: 0.4,
    marginBottom: -4,
  },
  input: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: "rgba(255, 252, 247, 0.9)",
    borderWidth: 1.5,
    borderColor: "#C8D8C4",
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 15,
    color: "#2E3A28",
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelBtnText: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 14,
    color: "#7A9E7E",
    fontWeight: "600",
  },
  forgotText: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 13,
    color: "#B0A898",
    textAlign: "center",
    textDecorationLine: "underline",
  },

  // ── Footer
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  footerText: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontStyle: "italic",
    fontSize: 12,
    color: "#B0A898",
    letterSpacing: 1,
  },
});