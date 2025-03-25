import { BookOpen, MessageSquare, Target, Users } from "lucide-react";
import { FC } from "react";
import { Link } from "react-router-dom";
import "./Home.styles.css";
import { useUser } from "../../context/UserContext";

const Home: FC = () => {
  const { user } = useUser();
  
  return (
    <main>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Unlock Your Learning Journey</h1>
            <p>
              Connect with mentors, share knowledge, and access educational
              resources in a dynamic, community-driven platform.
            </p>
            {user ? (
              <Link to="/posts" className="cta-button">
                Explore Posts
              </Link>
            ) : (
              <Link to="/login" className="cta-button">
                Start Learning
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Your Learning Community Awaits</h2>
          <p
            style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}
          >
            The Learning and Development Hub connects individuals passionate
            about learning. Whether you're a mentor, a student, or an educator,
            this space offers resources, real-time discussions, and
            opportunities to collaborate.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Core Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <BookOpen size={48} color="#052659" />
              <h3>Interactive Learning</h3>
              <p>
                Collaborate with mentors and peers in real-time discussions and
                group chats.
              </p>
            </div>
            <div className="feature-card">
              <Users size={48} color="#052659" />
              <h3>Resource Sharing</h3>
              <p>
                Access, upload, and share educational materials, projects, and
                tutorials.
              </p>
            </div>
            <div className="feature-card">
              <Target size={48} color="#052659" />
              <h3>Personalized Learning</h3>
              <p>
                Create your own learning journey with curated resources tailored
                to your goals.
              </p>
            </div>
            <div className="feature-card">
              <MessageSquare size={48} color="#052659" />
              <h3>Community Engagement</h3>
              <p>
                Join interest groups, attend live events, and participate in
                learning challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section testimonials">
        <div className="container">
          <h2 className="section-title">What Our Community Says</h2>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80"
                alt="Sarah M."
              />
              <h3>Sarah M.</h3>
              <p>
                "The mentorship program helped me transition into tech. My
                mentor's guidance was invaluable!"
              </p>
            </div>
            <div className="testimonial-card">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80"
                alt="David R."
              />
              <h3>David R.</h3>
              <p>
                "As a mentor, seeing my students grow and succeed has been
                incredibly rewarding."
              </p>
            </div>
            <div className="testimonial-card">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80"
                alt="Emily K."
              />
              <h3>Emily K.</h3>
              <p>
                "The community here is amazing! I've learned so much from fellow
                learners."
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-links">
              <h4>Platform</h4>
              <ul>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/features">Features</Link>
                </li>
                <li>
                  <Link to="/pricing">Pricing</Link>
                </li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Resources</h4>
              <ul>
                <li>
                  <Link to="/blog">Blog</Link>
                </li>
                <li>
                  <Link to="/guides">Guides</Link>
                </li>
                <li>
                  <Link to="/help">Help Center</Link>
                </li>
              </ul>
            </div>
            <div className="footer-links">
              <h4>Legal</h4>
              <ul>
                <li>
                  <Link to="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/cookies">Cookie Policy</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;
