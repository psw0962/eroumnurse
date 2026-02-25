import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from './assets/logo.png';
import logo_white from './assets/logo-white.svg';

/* ── 데이터 ─────────────────────────────────────────── */
const SERVICES = [
  { icon: "💉", title: "전문 간호 서비스",     desc: "욕창, 상처 드레싱, 콧줄, 소변줄 관리 등 가정에서 필요한 전문 간호 처치를 면허 간호사/간호조무사가 직접 제공합니다." },
  { icon: "💊", title: "투약 관리",            desc: "복잡한 약물 복용 스케줄을 관리하고, 부작용 모니터링 및 의사와의 연계를 도와드립니다." },
  { icon: "🩺", title: "건강 상태 모니터링",   desc: "활력징후 측정, 혈당·혈압 관리 등 만성질환 어르신의 건강 변화를 체계적으로 관찰합니다." },
  { icon: "🧠", title: "인지기능 관리",         desc: "치매·인지 저하 어르신을 위한 전문적인 인지 자극 프로그램을 간호사/간호조무사가 직접 설계·운영합니다." },
  { icon: "🏥", title: "1:1 맞춤 방문재활",    desc: "뇌졸증, 파킨슨, 수술 후 가정에서 맞춤 재활을 밀착 지원하여 재입원을 예방합니다." },
  { icon: "👨‍👩‍👧", title: "가족 교육 및 상담",   desc: "보호자가 가정에서 올바른 돌봄을 실천할 수 있도록 간호사/간호조무사가 직접 교육하고 상담합니다." },
];

const WHY_US = [
  { icon: "👩‍⚕️", title: "100% 면허 간호사 운영",   desc: "요양보호사가 아닌 국가면허 간호사 또는 간호조무사가 직접 방문합니다." },
  { icon: "📋", title: "개인 맞춤 간호 계획",        desc: "어르신별 건강 상태에 맞는 간호 계획을 수립합니다." },
  { icon: "🔗", title: "의료기관 연계 시스템",       desc: "병원·의원과의 긴밀한 연계로 신속한 의료 대응이 가능합니다." },
  { icon: "📊", title: "체계적 기록 관리",           desc: "매 방문 간호 기록을 작성하여 가족과 투명하게 공유합니다." },
];

const PLANS = [
  {
    name: "기본형", hours: "주 3회 · 회당 3시간", highlight: false,
    features: ["전문 간호 처치", "투약 관리", "건강 상태 모니터링", "월 1회 관리자 방문"],
  },
  {
    name: "표준형", hours: "주 5회 · 회당 4시간", highlight: true,
    features: ["전문 간호 처치 전체", "인지기능 관리 프로그램", "만성질환 집중 관리", "외출 동행", "월 2회 관리자 방문"],
  },
  {
    name: "집중형", hours: "주 7회 · 시간 협의", highlight: false,
    features: ["전체 서비스 포함", "담당 간호사 전담 배정", "24시간 긴급 연락망", "가족 교육·상담 무제한"],
  },
];

const STEPS = [
  { num: "01", title: "무료 상담 신청",     desc: "전화 또는 온라인으로 간단히 신청해 주세요." },
  { num: "02", title: "간호사 방문 상담",   desc: "면허 간호사/간호조무사가 직접 방문하여 어르신 건강 상태를 전문적으로 평가합니다." },
  { num: "03", title: "장기요양 등급 신청", desc: "공단에 등급 신청을 도와드립니다." },
  { num: "04", title: "담당 간호사 매칭",   desc: "어르신의 질환과 성향에 맞는 전담 간호사를 신중하게 배정합니다." },
  { num: "05", title: "방문 간호 시작",     desc: "정해진 일정에 따라 전문 방문 간호 서비스를 시작합니다." },
];

const GRADES = ["1등급", "2등급", "3등급", "4등급", "5등급", "인지지원등급", "등급 없음 / 미신청"];

function useFadeIn(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function FadeIn({ children, delay = 0 }) {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [scrolled, setScrolled]   = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const [menuOpen, setMenuOpen]   = useState(false);
  const [form, setForm]           = useState({ name: "", phone: "", grade: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [ringing, setRinging] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const ids = ["why", "services", "process", "pricing", "contact"];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const { top, bottom } = el.getBoundingClientRect();
          if (top <= 100 && bottom >= 100) { setActiveNav(id); break; }
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };
  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="font-sans bg-bora-50 text-bora-900 min-h-screen">

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen ? "bg-bora-50/98 backdrop-blur-md border-b border-bora-200 shadow-sm" : "bg-transparent"
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <button
            onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setMenuOpen(false); }}
            className="flex items-center gap-1.5"
          >
            <img src={logo} alt="logo" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
            <span className="font-bold text-bora-600 text-sm sm:text-base leading-tight">
              이로움방문간호센터
            </span>
          </button>

          {/* 데스크탑 메뉴 */}
          <div className="hidden md:flex items-center gap-7">
            {[["센터 소개","why"],["서비스","services"],["이용절차","process"],["요금안내","pricing"]].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`text-sm relative pb-0.5 transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-bora-600 after:rounded-full after:transition-all after:duration-300 ${
                  activeNav === id ? "text-bora-600 after:w-full" : "text-bora-500 hover:text-bora-600 after:w-0 hover:after:w-full"
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("contact")}
              className="bg-linear-to-r from-bora-600 to-bora-500 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-bora hover:-translate-y-0.5 hover:shadow-bora-lg transition-all duration-200"
            >
              무료 상담 신청
            </button>
          </div>

          {/* 햄버거 버튼 */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            aria-label="메뉴"
          >
            <span className={`block w-6 h-0.5 bg-bora-600 rounded-full transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-bora-600 rounded-full transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-bora-600 rounded-full transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* 모바일 드롭다운 */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="px-4 pb-5 pt-2 flex flex-col gap-1 bg-bora-50/98 border-t border-bora-100">
            {[["센터 소개","why"],["서비스","services"],["이용절차","process"],["요금안내","pricing"]].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left px-4 py-3 text-bora-700 font-medium rounded-xl hover:bg-bora-100 transition-colors duration-200"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("contact")}
              className="mt-2 bg-linear-to-r from-bora-600 to-bora-500 text-white font-bold px-4 py-3 rounded-xl shadow-bora text-center"
            >
              무료 상담 신청
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center relative overflow-hidden pt-16">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-bora-600 opacity-10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-lavender opacity-10 blur-[80px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-56 h-56 rounded-full bg-accent opacity-5 blur-[70px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
            <div className="text-center md:text-left order-2 md:order-1">
              <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-5 text-bora-900">
                전문 간호사가<br />
                <span className="bg-linear-to-r from-bora-600 to-lavender bg-clip-text text-transparent">
                  직접 찾아갑니다
                </span>
              </h1>

              <p className="text-bora-500 leading-relaxed mb-8 text-sm sm:text-[0.97rem]">
                이로움방문간호센터는 <strong className="text-bora-600">국가면허 간호사/간호조무사</strong>가 직접 운영·방문하는
                방문간호센터입니다. 어르신의 건강을 의료 전문가의 눈으로 세심하게 살펴드립니다.
                아산병원 출신 의학박사가 교육하는 수련과정을 수료한 선생님들이 방문하여 집에서도 병원급 재활/간호 서비스를 받으실 수 있습니다.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <button
                  onClick={() => scrollTo("contact")}
                  className="w-full bg-linear-to-r from-bora-600 to-bora-500 text-white font-bold px-7 py-3.5 rounded-xl shadow-bora hover:-translate-y-1 hover:shadow-bora-lg transition-all duration-200"
                >
                  무료 상담 신청하기 →
                </button>
                <button
                  onClick={() => scrollTo("services")}
                  className="w-full border-2 border-bora-600 text-bora-600 font-bold px-7 py-3.5 rounded-xl hover:bg-bora-100 hover:-translate-y-0.5 transition-all duration-200"
                >
                  서비스 보기
                </button>
              </div>

   <a href="tel:07048333569"
  onMouseEnter={() => setRinging(true)}
  onMouseLeave={() => setRinging(false)}
  className="inline-flex items-center justify-center gap-3 from-bora-600 to-bora-500 font-bold w-full px-6 py-4 mt-4 rounded-2xl shadow-bora hover:shadow-bora-lg hover:-translate-y-1 transition-all duration-200 group"
>
  <span
    className="text-2xl inline-block"
    style={{ animation: ringing ? "ring 0.5s ease-in-out infinite" : "none" }}
  >
    📞
  </span>
  <div className="flex flex-col leading-tight">
    <span className="text-xs font-bloc tracking-wide text-bora-600">24시간 상담 가능</span>
    <span className="text-lg font-black tracking-wider text-bora-600">070-4833-3569</span>
  </div>
</a>
            </div>

            <div className="animate-float order-1 md:order-2">
              <div className="relative bg-linear-to-br from-bora-100 to-bora-200 rounded-3xl p-8 sm:p-12 text-center border-2 border-bora-200 overflow-hidden">
                <div className="absolute top-0 right-0 w-28 h-28 rounded-bl-full bg-linear-to-br from-bora-600/10 to-lavender/10" />
                <img src={logo} alt="logo" className="w-28 h-28 sm:w-40 sm:h-40 object-contain mx-auto mb-4" />
                <div className="font-bold text-lg sm:text-xl text-bora-600 mb-1">
                  간호사가 운영하는<br />방문간호센터
                </div>
                <div className="text-sm text-bora-500 mb-5">국가면허 간호사/간호조무사 직접 방문</div>
                <div className="inline-flex items-center gap-2 bg-bora-600/10 rounded-xl px-4 py-2.5">
                  <span>🏥</span>
                  <span className="text-sm text-bora-600 font-semibold">장기요양 인정기관</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why" className="py-16 sm:py-24 bg-white px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10 sm:mb-14">
              <p className="text-xs font-bold text-bora-600 tracking-[0.15em] mb-2 uppercase">Why Eroum</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                <span className="text-bora-600">간호사가 운영</span>하는 센터가 다른 이유
              </h2>
              <p className="text-bora-500 max-w-md mx-auto leading-relaxed text-sm">
                단순한 요양 서비스를 넘어, 의료 전문성을
              </p>
              <p className="text-bora-500 max-w-md mx-auto leading-relaxed text-sm">
                기반으로 한 체계적인 건강 관리를 제공합니다.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {WHY_US.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="bg-bora-50 border border-bora-200 rounded-2xl p-6 hover:border-bora-400 hover:shadow-bora hover:-translate-y-1 transition-all duration-300">
                  <div className="text-3xl mb-4">{item.icon}</div>
                  <h3 className="font-bold text-base mb-2 text-bora-900">{item.title}</h3>
                  <p className="text-bora-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.15}>
            <div className="mt-8 sm:mt-10 bg-linear-to-r from-bora-600 to-bora-500 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-bora-lg">
              <div>
                <h3 className="font-bold text-white text-lg sm:text-xl mb-1">지금 바로 무료 방문 상담을 받아보세요</h3>
                <p className="text-white/75 text-sm">간호사가 직접 방문하여 어르신 건강 상태를 평가해드립니다.</p>
              </div>
              <button
                onClick={() => scrollTo("contact")}
                className="bg-white text-bora-600 font-bold px-6 py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 shrink-0 w-full sm:w-auto text-center"
              >
                상담 신청하기 →
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-16 sm:py-24 bg-bora-100 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10 sm:mb-14">
              <p className="text-xs font-bold text-bora-600 tracking-[0.15em] mb-2 uppercase">Services</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-bora-900">제공 서비스</h2>
              <p className="text-bora-500 text-sm leading-relaxed">
                어르신 한 분 한 분의 건강 상태에 맞게 필요한 간호 서비스를 맞춤 제공합니다.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {SERVICES.map((s, i) => (
              <FadeIn key={s.title} delay={i * 0.08}>
                <div className="bg-white rounded-2xl p-6 sm:p-7 border border-bora-200 hover:border-bora-400 hover:shadow-bora hover:-translate-y-2 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-bora-100 flex items-center justify-center text-2xl mb-5">
                    {s.icon}
                  </div>
                  <h3 className="font-bold text-base mb-2 text-bora-900">{s.title}</h3>
                  <p className="text-bora-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="py-16 sm:py-24 bg-white px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10 sm:mb-14">
              <p className="text-xs font-bold text-bora-600 tracking-[0.15em] mb-2 uppercase">Process</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-bora-900">이용 절차</h2>
            </div>
          </FadeIn>
          <div className="relative">
            <div className="absolute left-[25px] top-14 bottom-0 w-0.5 bg-linear-to-b from-bora-600 to-bora-200" />
            <div className="flex flex-col gap-4 sm:gap-5">
              {STEPS.map((step, i) => (
                <FadeIn key={step.num} delay={i * 0.1}>
                  <div className="flex gap-4 sm:gap-5 items-start relative z-10">
                    <div className={`shrink-0 w-[52px] h-[52px] rounded-full flex items-center justify-center font-bold text-sm ${
                      i === 0 ? "bg-linear-to-br from-bora-600 to-bora-500 text-white shadow-bora" : "bg-white border-2 border-bora-200 text-bora-600"
                    }`}>
                      {step.num}
                    </div>
                    <div className="flex-1 bg-bora-50 border border-bora-200 rounded-2xl px-5 sm:px-6 py-4 sm:py-5">
                      <h4 className="font-bold text-base mb-1 text-bora-900">{step.title}</h4>
                      <p className="text-bora-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-16 sm:py-24 bg-bora-100 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-4">
              <p className="text-xs font-bold text-bora-600 tracking-[0.15em] mb-2 uppercase">Pricing</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-bora-900">요금 안내</h2>
              <p className="text-bora-500 text-sm">장기요양보험 적용 시 본인부담금은 소득 수준에 따라 달라집니다.</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10 sm:mt-12 items-center">
            {PLANS.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.1}>
                <div className={`relative rounded-3xl p-7 sm:p-9 border-2 transition-all duration-300 ${
                  plan.highlight
                    ? "bg-linear-to-b from-bora-600 to-bora-700 border-transparent text-white shadow-bora-lg sm:scale-[1.04]"
                    : "bg-white border-bora-200 text-bora-900 hover:-translate-y-1 hover:shadow-bora"
                }`}>
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-accent to-lavender text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap tracking-wide">
                      ⭐ 가장 인기
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                  <div className={`text-sm mb-5 ${plan.highlight ? "text-white/70" : "text-bora-400"}`}>{plan.hours}</div>
                  <div className={`text-sm font-semibold mb-5 pb-5 border-b ${plan.highlight ? "border-white/20 text-white" : "border-bora-200 text-bora-700"}`}>
                    본인부담금 산정 후 안내
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <span className={`font-bold mt-0.5 ${plan.highlight ? "text-lavender" : "text-bora-600"}`}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => scrollTo("contact")}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                      plan.highlight
                        ? "bg-white text-bora-600 hover:bg-bora-50 hover:shadow-lg"
                        : "bg-linear-to-r from-bora-600 to-bora-500 text-white hover:shadow-bora hover:-translate-y-0.5"
                    }`}
                  >
                    상담 신청하기
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.2}>
            <div className="mt-6 sm:mt-8 bg-white border border-bora-200 rounded-2xl p-5 sm:p-6 flex gap-3 items-start">
              <span className="text-xl mt-0.5 shrink-0">ℹ️</span>
              <p className="text-sm text-bora-500 leading-relaxed">
                <strong className="text-bora-600">장기요양등급이 없으셔도 괜찮습니다.</strong>{" "}
                등급 신청부터 서비스 시작까지 모든 과정을 도와드립니다. 정확한 본인부담금은 상담을 통해 안내드립니다.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-16 sm:py-24 bg-white px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <div className="text-center mb-10 sm:mb-12">
              <p className="text-xs font-bold text-bora-600 tracking-[0.15em] mb-2 uppercase">Contact</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-bora-900">무료 상담 신청</h2>
              <p className="text-bora-500 text-sm">남겨주신 연락처로 24시간 내에 담당 간호사가 직접 연락드립니다.</p>
            </div>
          </FadeIn>

          {submitted ? (
            <FadeIn>
              <div className="bg-bora-100 border-2 border-bora-200 rounded-3xl p-12 sm:p-16 text-center">
                <div className="text-6xl mb-4">💜</div>
                <h3 className="text-2xl font-bold text-bora-600 mb-2">상담 신청이 완료되었습니다!</h3>
                <p className="text-bora-500 leading-relaxed text-sm">
                  담당 간호사가 직접 연락드릴 예정입니다.<br />빠른 시일 내에 연락드리겠습니다.
                </p>
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <form
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="bg-bora-50 border border-bora-200 rounded-3xl p-6 sm:p-8 space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5 text-bora-900">성함 *</label>
                    <input
                      required value={form.name} onChange={setField("name")}
                      placeholder="홍길동"
                      className="w-full px-4 py-3 border border-bora-200 rounded-xl text-sm bg-white text-bora-900 placeholder-bora-300 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5 text-bora-900">연락처 *</label>
                    <input
                      required value={form.phone} onChange={setField("phone")}
                      placeholder="010-0000-0000"
                      className="w-full px-4 py-3 border border-bora-200 rounded-xl text-sm bg-white text-bora-900 placeholder-bora-300 transition-all duration-200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-bora-900">장기요양 등급</label>
                  <select
                    value={form.grade} onChange={setField("grade")}
                    className="w-full px-4 py-3 border border-bora-200 rounded-xl text-sm bg-white text-bora-900 transition-all duration-200"
                  >
                    <option value="">선택해주세요</option>
                    {GRADES.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-bora-900">문의 내용</label>
                  <textarea
                    value={form.message} onChange={setField("message")}
                    rows={4}
                    placeholder="어르신의 건강 상태나 필요한 서비스에 대해 자유롭게 적어주세요."
                    className="w-full px-4 py-3 border border-bora-200 rounded-xl text-sm bg-white text-bora-900 placeholder-bora-300 resize-y transition-all duration-200"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-bora-600 to-bora-500 text-white font-bold py-4 rounded-xl shadow-bora hover:-translate-y-0.5 hover:shadow-bora-lg transition-all duration-200"
                >
                  상담 신청하기 →
                </button>
                <p className="text-center text-xs text-bora-400">입력하신 개인정보는 상담 목적으로만 사용됩니다.</p>
              </form>
            </FadeIn>
          )}

          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
              {[
                ["📞","전화 상담","070-4833-3569","24시간 상담 가능"],
                ["📍","센터 위치","인천광역시 부평구","경인로903, 3층(부평동)"],
                ["🚨","긴급 연락","24시간 운영","응급 상황 즉시 대응"],
              ].map(([icon, title, l1, l2]) => (
                <div key={title} className="bg-bora-50 border border-bora-200 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">{icon}</div>
                  <div className="text-[0.68rem] text-bora-400 mb-0.5">{title}</div>
                  <div className="font-bold text-bora-600 text-sm">{l1}</div>
                  <div className="text-[0.68rem] text-bora-400 mt-0.5">{l2}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-bora-900 text-white/60 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-1.5 mb-3">
              <img src={logo_white} alt="logo" className="w-9 h-9 object-contain" />
              <div className="flex flex-col">
                <span className="font-bold text-white text-base">이로움방문간호센터</span>
                <span className="text-xs text-white/50">간호사가 운영하는 방문간호센터</span>
              </div>
            </div>
            <div className="text-sm leading-7 text-white/50">
              <div>대표: 박제인</div>
              <div>고유번호: 203-80-03971</div>
              <div>주소: 인천광역시 부평구 경인로 903, 3층(부평동)</div>
              <div>이메일: janeee3299@gmail.com</div>
              <div>대표전화: 070-4833-3569</div>
            </div>
          </div>
          <div className="border-b border-white/10 my-4" />
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-white/30">© 2026 이로움방문간호센터. All rights reserved.</p>
            <div className="flex gap-5 text-xs text-white/40">
              <button className="hover:text-white/70 transition-colors duration-200" onClick={() => navigate("/privacy")}>개인정보처리방침</button>
              <button className="hover:text-white/70 transition-colors duration-200" onClick={() => navigate("/terms")}>이용약관</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}