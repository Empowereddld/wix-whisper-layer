import { School, BookOpen, Stethoscope, Users } from "lucide-react";

const items = [
  {
    icon: School,
    title: "Schools",
    description: "Equip every classroom with DLD representation.",
  },
  {
    icon: BookOpen,
    title: "Libraries",
    description: "Give every child access to stories that reflect their experience.",
  },
  {
    icon: Stethoscope,
    title: "Clinics",
    description: "Use in waiting rooms, therapy sessions and share with families.",
  },
  {
    icon: Users,
    title: "Organizations",
    description: "Implement district-wide DLD awareness and support.",
  },
];

const BulkOrdersWhoSection = () => {
  return (
    <section className="bg-black text-white py-16 md:py-20">
      <div className="max-w-[1100px] mx-auto px-6 md:px-10">
        <h2 className="text-[26px] md:text-[32px] lg:text-[38px] font-black text-center leading-[1.1] mb-12">
          Who this is for:
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 text-center">
          {items.map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-3">
              <item.icon className="w-12 h-12 text-white/80" strokeWidth={1.2} />
              <h3 className="text-[16px] md:text-[18px] font-bold">{item.title}</h3>
              <p className="text-[13px] text-white/60 leading-[1.6] max-w-[220px]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BulkOrdersWhoSection;
