import { useState, useRef } from "react";
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
  Animated,
} from "react-native";
import Svg, { Ellipse, Path, Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import { useRouter } from "expo-router";

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
          <RadialGradient id="vsky" cx="50%" cy="0%" r="80%">
            <Stop offset="0%" stopColor={C.blue} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={C.pink} stopOpacity="0.2" />
          </RadialGradient>
          <RadialGradient id="vbg" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={C.lightGreen} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={C.lightGreen} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="vyellow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={C.yellow} stopOpacity="0.45" />
            <Stop offset="100%" stopColor={C.yellow} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="vmagenta" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={C.magenta} stopOpacity="0.35" />
            <Stop offset="100%" stopColor={C.magenta} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="vpink" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={C.pink} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={C.pink} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Ellipse cx={width / 2} cy={-30} rx={width * 0.95} ry={height * 0.52} fill="url(#vsky)" />
        <Ellipse cx={-50} cy={height * 0.18} rx={230} ry={210} fill="url(#vbg)" />
        <Ellipse cx={width + 40} cy={height * 0.25} rx={250} ry={200} fill="url(#vyellow)" />
        <Ellipse cx={width + 20} cy={height * 0.6} rx={220} ry={200} fill="url(#vmagenta)" />
        <Ellipse cx={width * 0.5} cy={height * 0.92} rx={260} ry={200} fill="url(#vpink)" />

        {/* Hills */}
        <Path
          d={`M0 ${height*0.87} Q${width*0.2} ${height*0.77} ${width*0.5} ${height*0.83} Q${width*0.78} ${height*0.89} ${width} ${height*0.79} L${width} ${height} L0 ${height} Z`}
          fill={C.lightGreen} opacity={0.3}
        />
        <Path
          d={`M0 ${height*0.93} Q${width*0.35} ${height*0.86} ${width*0.65} ${height*0.9} Q${width*0.82} ${height*0.93} ${width} ${height*0.87} L${width} ${height} L0 ${height} Z`}
          fill={C.darkGreen} opacity={0.2}
        />

        {/* Floating spores */}
        {[
          [width*0.12, height*0.2,  C.yellow,     0.5],
          [width*0.82, height*0.28, C.magenta,    0.4],
          [width*0.55, height*0.13, C.blue,       0.45],
          [width*0.9,  height*0.5,  C.pink,       0.5],
          [width*0.06, height*0.62, C.lightGreen, 0.4],
        ].map(([cx, cy, color, opacity], i) => (
          <Circle key={i} cx={cx} cy={cy} r={3 + (i % 3)} fill={color} opacity={opacity} />
        ))}
      </Svg>
    </View>
  );
}

// ── Envelope illustration ────────────────────────────────────────────────────
function EnvelopeIcon({ verified }) {
  return (
    <Svg width={90} height={72} viewBox="0 0 90 72">
      {/* body */}
      <Path
        d="M5 14 Q5 7 12 7 L78 7 Q85 7 85 14 L85 58 Q85 65 78 65 L12 65 Q5 65 5 58 Z"
        fill={verified ? C.lightGreen : C.yellow} opacity={0.85}
      />
      {/* flap */}
      <Path
        d="M5 14 L45 40 L85 14"
        fill="none"
        stroke={verified ? C.darkGreen : C.magenta}
        strokeWidth={2.5} strokeLinecap="round"
      />
      {/* seal */}
      <Circle cx={45} cy={40} r={verified ? 0 : 6} fill={C.magenta} opacity={0.7} />
      {/* checkmark */}
      {verified && (
        <Path
          d="M30 38 L40 48 L60 28"
          fill="none" stroke={C.darkGreen}
          strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"
        />
      )}
    </Svg>
  );
}

// ── OTP digit boxes ──────────────────────────────────────────────────────────
function OtpInput({ value, onChange }) {
  const inputs = useRef([]);
  const digits = value.split("").concat(Array(6).fill("")).slice(0, 6);

  const handleChange = (text, i) => {
    const cleaned = text.replace(/[^0-9]/g, "").slice(-1);
    const arr = digits.map((d, idx) => idx === i ? cleaned : d);
    onChange(arr.join(""));
    if (cleaned && i < 5) inputs.current[i + 1]?.focus();
    if (!cleaned && i > 0) inputs.current[i - 1]?.focus();
  };

  const handleKeyPress = (e, i) => {
    if (e.nativeEvent.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  return (
    <View style={otpStyles.row}>
      {digits.map((d, i) => (
        <TextInput
          key={i}
          ref={el => inputs.current[i] = el}
          style={[otpStyles.box, d ? otpStyles.boxFilled : null]}
          value={d}
          onChangeText={t => handleChange(t, i)}
          onKeyPress={e => handleKeyPress(e, i)}
          keyboardType="number-pad"
          maxLength={1}
          textAlign="center"
          selectTextOnFocus
        />
      ))}
    </View>
  );
}

const otpStyles = StyleSheet.create({
  row: { flexDirection: "row", gap: 10, justifyContent: "center", marginVertical: 8 },
  box: {
    width: 46, height: 54, borderRadius: 14,
    borderWidth: 2, borderColor: C.lightGreen,
    backgroundColor: "rgba(255,255,255,0.75)",
    fontSize: 22, fontWeight: "700",
    color: C.dark,
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
  },
  boxFilled: {
    borderColor: C.darkGreen,
    backgroundColor: "rgba(163, 201, 136, 0.2)",
  },
});

// ── Main screen ──────────────────────────────────────────────────────────────
export default function VerifyScreen() {
  const router = useRouter();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const isEduEmail = (e) => /^[^\s@]+@[^\s@]+\.edu(\.[a-z]{2})?$/i.test(e.trim());

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleSendCode = () => {
    if (!isEduEmail(email)) {
      setError("Please enter a valid .edu email address.");
      shake();
      return;
    }
    setError("");
    setStep("otp");
  };

  const handleVerifyOtp = () => {
    if (otp.length < 6) {
      setError("Enter the 6-digit code we sent you.");
      shake();
      return;
    }
    setError("");
    setStep("done");
  };

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

        {/* ── Top bar ── */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.wordmark}>
            strike<Text style={styles.wordmarkDot}>.</Text>
          </Text>
          <View style={{ width: 60 }} />
        </View>

        {/* ── Step dots ── */}
        <View style={styles.stepRow}>
          <View style={[styles.stepDot, styles.stepDone]} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step !== "email" ? styles.stepDone : styles.stepActive]} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step === "done" ? styles.stepDone : styles.stepInactive]} />
        </View>

        {/* ── Envelope ── */}
        <View style={styles.illustrationArea}>
          <EnvelopeIcon verified={step === "done"} />
        </View>

        {/* ════ EMAIL STEP ════ */}
        {step === "email" && (
          <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>
            <Text style={styles.cardTitle}>
              Verify your{"\n"}
              <Text style={styles.cardAccent}>college email</Text>
            </Text>
            <Text style={styles.cardSub}>
              Strike is for students only. Enter your .edu address and {"we'll"} send a quick code.
            </Text>

            <Text style={styles.inputLabel}>College email</Text>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="you@university.edu"
              placeholderTextColor={C.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={t => { setEmail(t); setError(""); }}
              onSubmitEditing={handleSendCode}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.primaryBtn} onPress={handleSendCode} activeOpacity={0.82}>
              <Text style={styles.primaryBtnText}>Send verification code →</Text>
            </TouchableOpacity>

            <View style={styles.safetyNote}>
              <Text style={styles.safetyIcon}>🔒</Text>
              <Text style={styles.safetyText}>
                We never share your email. {"It's"} only used to confirm {"you're"} a student.
              </Text>
            </View>
          </Animated.View>
        )}

        {/* ════ OTP STEP ════ */}
        {step === "otp" && (
          <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>
            <Text style={styles.cardTitle}>
              Check your{"\n"}
              <Text style={styles.cardAccent}>inbox ✦</Text>
            </Text>
            <Text style={styles.cardSub}>
              We sent a 6-digit code to{"\n"}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>

            <OtpInput value={otp} onChange={setOtp} />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.primaryBtn} onPress={handleVerifyOtp} activeOpacity={0.82}>
              <Text style={styles.primaryBtnText}>Verify →</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendBtn} onPress={() => setStep("email")}>
              <Text style={styles.resendText}>Wrong email? Go back</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSendCode}>
              <Text style={styles.resendText}>Resend code</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* ════ SUCCESS STEP ════ */}
        {step === "done" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {"You're"} verified{"\n"}
              <Text style={styles.cardAccent}>welcome! 🌿</Text>
            </Text>
            <Text style={styles.cardSub}>
              Your .edu address is confirmed. {"You're"} now part of the Strike community.
            </Text>

            <View style={styles.successBadge}>
              <Text style={styles.successBadgeText}>🎓 Verified student</Text>
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.push("/when")}
              activeOpacity={0.82}
            >
              <Text style={styles.primaryBtnText}>{"Let's"} find your people →</Text>
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
  root: { flex: 1, backgroundColor: C.bg },
  scroll: {
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 48,
    alignItems: "center",
    minHeight: height,
  },

  // ── Top bar
  topBar: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    width: "100%", marginBottom: 24,
  },
  backBtn: { width: 60 },
  backText: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 15, fontWeight: "600", color: C.darkGreen,
  },
  wordmark: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 26, fontWeight: "700", color: C.darkGreen,
    letterSpacing: -0.5, fontStyle: "italic",
  },
  wordmarkDot: { color: C.magenta },

  // ── Step dots
  stepRow: {
    flexDirection: "row", alignItems: "center",
    marginBottom: 28,
  },
  stepDot: { width: 10, height: 10, borderRadius: 5 },
  stepLine: { width: 32, height: 2, backgroundColor: "rgba(163,201,136,0.3)", marginHorizontal: 4 },
  stepActive: { backgroundColor: C.darkGreen, width: 24, borderRadius: 4 },
  stepDone: { backgroundColor: C.lightGreen },
  stepInactive: { backgroundColor: "rgba(163,201,136,0.25)" },

  // ── Illustration
  illustrationArea: { marginBottom: 20, alignItems: "center" },

  // ── Card
  card: {
    width: "100%",
    backgroundColor: "rgba(251, 219, 243, 0.55)",
    borderRadius: 24, padding: 24,
    borderWidth: 1.5, borderColor: "rgba(199, 152, 193, 0.4)",
    shadowColor: C.magenta,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 20,
    elevation: 4, gap: 12,
  },
  cardTitle: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 32, fontWeight: "700",
    color: C.dark, lineHeight: 40,
  },
  cardAccent: { color: C.darkGreen, fontStyle: "italic" },
  cardSub: {
    fontFamily: Platform.select({ ios: "Palatino", android: "serif", default: "Palatino, serif" }),
    fontSize: 15, color: C.mid, lineHeight: 22,
  },
  emailHighlight: {
    fontWeight: "700", color: C.darkGreen,
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
  },

  // ── Input
  inputLabel: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 13, color: C.mid, fontWeight: "600", letterSpacing: 0.4,
  },
  input: {
    width: "100%", paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 14, backgroundColor: "rgba(255,255,255,0.75)",
    borderWidth: 1.5, borderColor: C.lightGreen,
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 15, color: C.dark,
  },
  inputError: { borderColor: C.magenta },
  errorText: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 13, color: C.magenta, fontStyle: "italic",
  },

  // ── Buttons
  primaryBtn: {
    width: "100%", paddingVertical: 17, borderRadius: 18,
    backgroundColor: C.darkGreen, alignItems: "center",
    shadowColor: C.darkGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28, shadowRadius: 14, elevation: 6,
    marginTop: 4,
  },
  primaryBtnText: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 16, fontWeight: "700", color: "#ffffff", letterSpacing: 0.3,
  },
  resendBtn: { alignItems: "center", paddingVertical: 4 },
  resendText: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 13, color: C.darkGreen, textDecorationLine: "underline",
  },

  // ── Safety note
  safetyNote: {
    flexDirection: "row", gap: 8, alignItems: "flex-start",
    backgroundColor: "rgba(244, 220, 129, 0.25)",
    borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: "rgba(244, 220, 129, 0.6)",
  },
  safetyIcon: { fontSize: 14 },
  safetyText: {
    flex: 1,
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 12, color: C.mid, lineHeight: 18,
  },

  // ── Success badge
  successBadge: {
    backgroundColor: "rgba(163, 201, 136, 0.3)",
    borderRadius: 50, paddingHorizontal: 20, paddingVertical: 10,
    borderWidth: 1.5, borderColor: C.lightGreen,
    alignSelf: "center",
  },
  successBadgeText: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontSize: 15, fontWeight: "700", color: C.darkGreen,
  },

  // ── Footer
  footer: { marginTop: 36, alignItems: "center" },
  footerText: {
    fontFamily: Platform.select({ ios: "Georgia", android: "serif", default: "Georgia, serif" }),
    fontStyle: "italic", fontSize: 12, color: C.muted, letterSpacing: 1,
  },
});