import { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Svg, { Ellipse, Path, Circle, Defs, RadialGradient, Stop } from "react-native-svg";

const { width, height } = Dimensions.get("window");

// ── Color palette ────────────────────────────────────────────────────────────
const C = {
  lightGreen:  "#a3c988",
  darkGreen:   "#85a75c",
  blue:        "#a6c1dc",
  yellow:      "#f4dc81",
  magenta:     "#c798c1",
  pink:        "#fbdbf3",
  bg:          "#f7f5ef",
  dark:        "#2e3a1e",
  mid:         "#5a6e3a",
  muted:       "#8a9a72",
};

// ── Watercolor blob background ───────────────────────────────────────────────
function WatercolorBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <RadialGradient id="sky" cx="50%" cy="0%" r="80%">
            <Stop offset="0%" stopColor={C.blue} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={C.pink} stopOpacity="0.2" />
          </RadialGradient>
          <RadialGradient id="blobGreen" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={C.lightGreen} stopOpacity="0.55" />
            <Stop offset="100%" stopColor={C.lightGreen} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="blobYellow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={C.yellow} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={C.yellow} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="blobBlue" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={C.blue} stopOpacity="0.45" />
            <Stop offset="100%" stopColor={C.blue} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="blobMagenta" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={C.magenta} stopOpacity="0.35" />
            <Stop offset="100%" stopColor={C.magenta} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="blobPink" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={C.pink} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={C.pink} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Sky wash */}
        <Ellipse cx={width / 2} cy={-30} rx={width * 0.95} ry={height * 0.52} fill="url(#sky)" />

        {/* Light green — top left */}
        <Ellipse cx={-50} cy={height * 0.16} rx={230} ry={210} fill="url(#blobGreen)" />

        {/* Yellow — top right */}
        <Ellipse cx={width + 40} cy={height * 0.22} rx={250} ry={200} fill="url(#blobYellow)" />

        {/* Blue — mid left */}
        <Ellipse cx={width * 0.1} cy={height * 0.55} rx={200} ry={180} fill="url(#blobBlue)" />

        {/* Magenta — mid right */}
        <Ellipse cx={width + 20} cy={height * 0.58} rx={220} ry={200} fill="url(#blobMagenta)" />

        {/* Pink — bottom */}
        <Ellipse cx={width * 0.6} cy={height * 0.9} rx={260} ry={200} fill="url(#blobPink)" />

        {/* Painterly grass hills */}
        <Path
          d={`M0 ${height*0.87} Q${width*0.2} ${height*0.77} ${width*0.5} ${height*0.83} Q${width*0.78} ${height*0.89} ${width} ${height*0.79} L${width} ${height} L0 ${height} Z`}
          fill={C.lightGreen} opacity={0.3}
        />
        <Path
          d={`M0 ${height*0.93} Q${width*0.35} ${height*0.86} ${width*0.65} ${height*0.9} Q${width*0.82} ${height*0.93} ${width} ${height*0.87} L${width} ${height} L0 ${height} Z`}
          fill={C.darkGreen} opacity={0.2}
        />

        {/* Floating spores in palette colors */}
        {[
          [width*0.12, height*0.2,  C.yellow,  0.5],
          [width*0.82, height*0.28, C.magenta, 0.4],
          [width*0.55, height*0.13, C.blue,    0.45],
          [width*0.9,  height*0.5,  C.pink,    0.5],
          [width*0.06, height*0.62, C.lightGreen, 0.4],
          [width*0.7,  height*0.72, C.yellow,  0.35],
        ].map(([cx, cy, color, opacity], i) => (
          <Circle key={i} cx={cx} cy={cy} r={3 + (i % 3)} fill={color} opacity={opacity} />
        ))}
      </Svg>
    </View>
  );
}

// ── Sprout icon ──────────────────────────────────────────────────────────────
function SproutIcon() {
  return (
    <Svg width={70} height={70} viewBox="0 0 70 70">
      <Path d="M35 60 Q35 40 35 28" stroke={C.darkGreen} strokeWidth={3} strokeLinecap="round" fill="none" />
      <Path d="M35 38 Q18 32 16 18 Q28 16 36 30" fill={C.lightGreen} opacity={0.9} />
      <Path d="M35 30 Q52 24 54 10 Q42 8 34 22" fill={C.darkGreen} opacity={0.85} />
      <Circle cx={35} cy={20} r={7} fill={C.yellow} opacity={0.9} />
      <Circle cx={35} cy={20} r={4} fill={C.magenta} opacity={0.7} />
      <Circle cx={25} cy={63} r={3} fill={C.lightGreen} opacity={0.5} />
      <Circle cx={35} cy={65} r={4} fill={C.darkGreen} opacity={0.4} />
      <Circle cx={45} cy={62} r={3} fill={C.lightGreen} opacity={0.5} />
    </Svg>
  );
}

// ── Main Landing Screen ──────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();
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

        {/* ── Wordmark ── */}
        <View style={styles.wordmarkRow}>
          <Text style={styles.wordmark}>strike</Text>
          <View style={styles.dotAccent} />
        </View>

        {/* ── Hero ── */}
        <View style={styles.heroArea}>
          <SproutIcon />
          <View style={styles.taglineBadge}>
            <Text style={styles.taglineText}>{"who's free tonight?"}</Text>
          </View>
        </View>

        {/* ── Headline ── */}
        <View style={styles.headlineBlock}>
          <Text style={styles.headline}>
            Find your{"\n"}people,{" "}
            <Text style={styles.headlineAccent}>right now.</Text>
          </Text>
          <Text style={styles.subline}>
            Real hangouts with verified students{"\n"}near you — no feeds, just plans.
          </Text>
        </View>

        {/* ── Verify badge ── */}
        <View style={styles.verifyRow}>
          <Text style={styles.verifyIcon}>🎓</Text>
          <Text style={styles.verifyText}>College students only · .edu verified</Text>
        </View>

        {/* ── Buttons / Login ── */}
        {!showLogin ? (
          <View style={styles.ctaBlock}>
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.82}
              onPress={() => router.push("/verify")}
            >
              <Text style={styles.primaryBtnText}>{"⚡  I'm down to hang"}</Text>
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
          <View style={styles.loginCard}>
            <Text style={styles.loginTitle}>Welcome back ✦</Text>

            <Text style={styles.inputLabel}>College email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@university.edu"
              placeholderTextColor={C.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={C.muted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.82}>
              <Text style={styles.primaryBtnText}>Log in →</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowLogin(false)}>
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
    backgroundColor: C.bg,
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
    color: C.darkGreen,
    letterSpacing: -0.5,
    fontStyle: "italic",
  },
  dotAccent: {
    width: 8, height: 8,
    borderRadius: 4,
    backgroundColor: C.magenta,
    marginTop: 6,
  },

  // ── Hero
  heroArea: {
    alignItems: "center",
    marginBottom: 24,
    gap: 14,
  },
  taglineBadge: {
    backgroundColor: "rgba(163, 201, 136, 0.25)",
    borderWidth: 1.5,
    borderColor: C.lightGreen,
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  taglineText: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontStyle: "italic",
    fontSize: 15,
    color: C.darkGreen,
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
    color: C.dark,
    textAlign: "center",
    lineHeight: 52,
    letterSpacing: -0.5,
    marginBottom: 14,
  },
  headlineAccent: {
    color: C.darkGreen,
    fontStyle: "italic",
  },
  subline: {
    fontFamily: Platform.select({ ios: "Palatino", android: "serif", default: "Palatino, serif" }),
    fontSize: 16,
    color: C.mid,
    textAlign: "center",
    lineHeight: 24,
  },

  // ── Verify badge
  verifyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(244, 220, 129, 0.3)",
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 36,
    borderWidth: 1,
    borderColor: "rgba(244, 220, 129, 0.7)",
  },
  verifyIcon: { fontSize: 16 },
  verifyText: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 13,
    color: C.mid,
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
    backgroundColor: C.darkGreen,
    alignItems: "center",
    shadowColor: C.darkGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  primaryBtnText: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 17,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: "transparent",
    alignItems: "center",
    borderWidth: 2,
    borderColor: C.lightGreen,
  },
  secondaryBtnText: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 16,
    fontWeight: "600",
    color: C.darkGreen,
    letterSpacing: 0.2,
  },

  // ── Login card
  loginCard: {
    width: "100%",
    backgroundColor: "rgba(251, 219, 243, 0.65)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: "rgba(199, 152, 193, 0.45)",
    shadowColor: C.magenta,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 4,
    gap: 10,
  },
  loginTitle: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 22,
    fontWeight: "700",
    color: C.dark,
    fontStyle: "italic",
    marginBottom: 6,
    textAlign: "center",
  },
  inputLabel: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 13,
    color: C.mid,
    fontWeight: "600",
    letterSpacing: 0.4,
    marginBottom: -4,
  },
  input: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderWidth: 1.5,
    borderColor: C.lightGreen,
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 15,
    color: C.dark,
  },
  cancelBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelBtnText: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 14,
    color: C.darkGreen,
    fontWeight: "600",
  },
  forgotText: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 13,
    color: C.muted,
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
    color: C.muted,
    letterSpacing: 1,
  },
});