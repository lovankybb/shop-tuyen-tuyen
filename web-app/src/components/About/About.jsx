import { useState } from "react";
import "./About.css";

const stats = [
  { number: "150", unit: "K+", label: "Khách hàng" },
  { number: "12", unit: "+", label: "Năm kinh nghiệm" },
  { number: "50", unit: "+", label: "Thương hiệu" },
  { number: "99", unit: "%", label: "Hài lòng" },
];

const values = [
  {
    icon: "🔬",
    name: "Công nghệ đỉnh cao",
    desc: "Chúng tôi luôn cập nhật và cung cấp những sản phẩm công nghệ mới nhất, tiên tiến nhất từ các thương hiệu hàng đầu thế giới.",
  },
  {
    icon: "🛡️",
    name: "Bảo hành chính hãng",
    desc: "Toàn bộ sản phẩm đều có tem bảo hành chính hãng, đảm bảo quyền lợi tối đa cho người tiêu dùng.",
  },
  {
    icon: "⚡",
    name: "Giao hàng tốc độ",
    desc: "Dịch vụ giao hàng nhanh trong 2 giờ nội thành, toàn quốc trong 24 giờ với đội ngũ logistics chuyên nghiệp.",
  },
  {
    icon: "💎",
    name: "Chất lượng đảm bảo",
    desc: "Mỗi sản phẩm được kiểm định nghiêm ngặt trước khi đến tay khách hàng, cam kết 100% hàng chính hãng.",
  },
  {
    icon: "🤝",
    name: "Hỗ trợ 24/7",
    desc: "Đội ngũ tư vấn viên sẵn sàng hỗ trợ khách hàng 24 giờ mỗi ngày, 7 ngày mỗi tuần.",
  },
  {
    icon: "🔄",
    name: "Đổi trả dễ dàng",
    desc: "Chính sách đổi trả minh bạch trong vòng 15 ngày, không cần lý do nếu sản phẩm còn nguyên vẹn.",
  },
];

const warranties = [
  {
    icon: "📱",
    title: "Bảo hành điện thoại",
    desc: "12–24 tháng bảo hành chính hãng tùy thương hiệu.",
    tag: "12–24 tháng",
  },
  {
    icon: "🔧",
    title: "Hỗ trợ kỹ thuật",
    desc: "Hỗ trợ cài đặt và khắc phục sự cố miễn phí.",
    tag: "Miễn phí 6 tháng",
  },
];

const team = [
  {
    emoji: "👨‍💼",
    name: "Nguyễn Minh Tuấn",
    role: "CEO & Founder",
    bio: "15 năm kinh nghiệm ngành công nghệ.",
  },
  {
    emoji: "👩‍💻",
    name: "Trần Thị Lan Anh",
    role: "CTO",
    bio: "Chuyên gia AI & Mobile Tech.",
  },
];

const contacts = [
  {
    icon: "📍",
    label: "Địa chỉ",
    value: "268 Tô Hiến Thành, P.15, Q.10",
    sub: "TP. Hồ Chí Minh, Việt Nam",
  },
  {
    icon: "📞",
    label: "Hotline",
    value: "1800 6868",
    sub: "8:00 – 22:00",
  },
];

export default function About() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (formData.name && formData.message) {
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          phone: "",
          email: "",
          message: "",
        });
      }, 3000);
    }
  };

  return (
    <div className="about-root">
      <div className="about-bg">
        <div className="about-bg-grid" />
        <div className="about-bg-orb orb-1" />
        <div className="about-bg-orb orb-2" />
      </div>

      <div className="about-content">

        {/* HERO */}
        <section className="about-hero">
          <div className="about-hero-eyebrow">
            ✦ Câu chuyện của chúng tôi ✦
          </div>

          <h1 className="about-hero-title">
            Về <span className="accent">TechNova</span>
          </h1>

          <p className="about-hero-sub">
            Hơn 12 năm đồng hành cùng người Việt trên hành trình khám phá công nghệ.
          </p>

          <div className="hero-line" />
        </section>

        {/* STATS */}
        <div className="about-stats">
          {stats.map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-number">
                {s.number}
                <span>{s.unit}</span>
              </div>

              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* STORY */}
        <section className="about-story">
          <div className="story-visual">
            <div className="story-glow" />

            <div className="story-icon-ring">
              <span className="story-emoji">🚀</span>
            </div>
          </div>

          <div className="story-text">
            <div className="section-eyebrow">Lịch sử hình thành</div>

            <h2 className="section-title">Từ đam mê đến sứ mệnh</h2>

            <p>
              TechNova được thành lập năm 2013 bởi một nhóm kỹ sư trẻ đam mê công nghệ.
            </p>

            <p>
              Chúng tôi không chỉ bán điện thoại — chúng tôi kiến tạo trải nghiệm công nghệ.
            </p>
          </div>
        </section>

        {/* VALUES */}
        <section className="about-values">
          <div className="section-eyebrow">Giá trị cốt lõi</div>

          <h2 className="section-title">Cam kết của TechNova</h2>

          <div className="values-grid">
            {values.map((v, i) => (
              <div className="value-card" key={i}>
                <span className="value-icon">{v.icon}</span>

                <div className="value-name">{v.name}</div>

                <p className="value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WARRANTY */}
        <section className="about-warranty">
          <div className="section-eyebrow">Chính sách bảo hành</div>

          <h2 className="section-title">
            Bảo vệ toàn diện — Yên tâm mua sắm
          </h2>

          <div className="warranty-grid">
            {warranties.map((w, i) => (
              <div className="warranty-card" key={i}>
                <div className="warranty-icon-box">{w.icon}</div>

                <div className="warranty-body">
                  <div className="warranty-title">{w.title}</div>

                  <p className="warranty-desc">{w.desc}</p>

                  <span className="warranty-tag">{w.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TEAM */}
        <section className="about-team">
          <div className="section-eyebrow">Đội ngũ</div>

          <h2 className="section-title">
            Những người tạo nên TechNova
          </h2>

          <div className="team-grid">
            {team.map((m, i) => (
              <div className="team-card" key={i}>
                <div className="team-avatar">{m.emoji}</div>

                <div className="team-name">{m.name}</div>

                <div className="team-role">{m.role}</div>

                <p className="team-bio">{m.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section className="about-contact">
          <div className="section-eyebrow">Liên hệ</div>

          <h2 className="section-title">
            Luôn sẵn sàng hỗ trợ bạn
          </h2>

          <div className="contact-grid">

            <div className="contact-info-col">
              {contacts.map((c, i) => (
                <div className="contact-item" key={i}>
                  <div className="contact-icon">{c.icon}</div>

                  <div>
                    <div className="contact-label">{c.label}</div>

                    <div className="contact-value">{c.value}</div>

                    <div className="contact-sub">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-map-col">
              <div className="contact-form-card">

                <div className="form-title">
                  GỬI TIN NHẮN CHO CHÚNG TÔI
                </div>

                {submitted ? (
                  <div className="form-success">
                    ✓ Cảm ơn! Chúng tôi sẽ liên hệ sớm nhất.
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <label className="form-label">Họ tên</label>

                      <input
                        className="form-input"
                        placeholder="Nguyễn Văn A"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nội dung</label>

                      <textarea
                        className="form-textarea"
                        placeholder="Bạn cần hỗ trợ gì?"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            message: e.target.value,
                          })
                        }
                      />
                    </div>

                    <button
                      className="form-submit"
                      onClick={handleSubmit}
                    >
                      Gửi tin nhắn →
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}