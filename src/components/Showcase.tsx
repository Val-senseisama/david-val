import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBrain,
  FaChartBar,
  FaCreditCard,
  FaDatabase,
  FaGem,
  FaTrophy,
} from "react-icons/fa";

const demos = [
  {
    title: "Inventory Dashboard",
    description: "Add, edit and delete stock with search and filters; data stays in your browser.",
    icon: <FaDatabase size={18} />,
    path: "/inventory",
  },
  {
    title: "Sales Forecast",
    description: "Upload a sales CSV, chart it, and project the next periods.",
    icon: <FaChartBar size={18} />,
    path: "/sales-forecast",
  },
  {
    title: "Multi-Vendor Payments",
    description: "Split a payment across vendors, platform fees and VAT, with payout history.",
    icon: <FaCreditCard size={18} />,
    path: "/multivendor",
  },
  {
    title: "GoalQuest",
    description: "Quests, XP and achievements for everyday goals.",
    icon: <FaTrophy size={18} />,
    path: "/goal-quest",
  },
  {
    title: "Mind Map Creator",
    description: "Drag nodes, connect ideas, and keep the map saved locally.",
    icon: <FaBrain size={18} />,
    path: "/mind-map",
  },
  {
    title: "ShardSpace",
    description: "Break a big goal into milestones and mini-quests: the prototype behind Shard.",
    icon: <FaGem size={18} />,
    path: "/shardspace",
  },
];

export default function Showcase() {
  return (
    <section className="z-section z-labs-band" id="labs">
      <div className="z-wrap">
        <div className="z-head">
          <div>
            <h2 className="z-h2" data-perch="">Demos</h2>
            <p className="z-lede">Small apps you can try here. They run in your browser.</p>
          </div>
        </div>
        <ul className="z-labs">
          {demos.map((d) => (
            <li key={d.path}>
              <Link to={d.path}>
                <span className="z-labs__icon" aria-hidden="true">
                  {d.icon}
                </span>
                <span>
                  <h3>{d.title}</h3>
                  <p>{d.description}</p>
                </span>
                <FaArrowRight className="z-arrow" size={13} style={{ marginTop: 8 }} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
