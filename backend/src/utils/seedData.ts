import { Doctor } from '../models/Doctor';
import { Video } from '../models/Video';
import { logger } from './logger';

export const seedDoctorsAndVideos = async () => {
  try {
    const doctorCount = await Doctor.countDocuments();
    if (doctorCount === 0) {
      logger.info('No doctors found in DB. Seeding initial doctors...');
      await Doctor.insertMany([
        {
          name: "Dr. Ananya Sharma",
          specialty: "Gynecologist & Obstetrician",
          experience: "15 years exp",
          rating: 4.9,
          reviews: 124,
          location: "Apollo Clinic, Andheri",
          distance: "2.5 km away",
          consultationFee: "₹800",
          languages: ["English", "Hindi", "Marathi"],
          isOnline: true
        },
        {
          name: "Dr. Ritu Desai",
          specialty: "Pediatrician",
          experience: "10 years exp",
          rating: 4.8,
          reviews: 89,
          location: "Sunshine Children's Hospital",
          distance: "3.1 km away",
          consultationFee: "₹600",
          languages: ["English", "Gujarati"],
          isOnline: false
        },
        {
          name: "Dr. Meera Reddy",
          specialty: "Psychiatrist (Women's Mental Health)",
          experience: "8 years exp",
          rating: 4.7,
          reviews: 56,
          location: "Mind Wellness Center",
          distance: "5.0 km away",
          consultationFee: "₹1000",
          languages: ["English", "Hindi", "Telugu"],
          isOnline: true
        }
      ]);
      logger.info('Successfully seeded doctors.');
    }

    const videoCount = await Video.countDocuments();
    if (videoCount === 0) {
      logger.info('No videos found in DB. Seeding initial videos...');
      await Video.insertMany([
        {
          title: "Understanding the Menstrual Cycle",
          description: "Learn about the four phases of the menstrual cycle, common symptoms, and how to maintain healthy habits.",
          duration: "2:45",
          tags: ["Biology", "Basics"],
          image: "/images/videos/video_1.png",
          youtubeId: "vOZTvQ40O0w"
        },
        {
          title: "Menstrual Hygiene & Safe Period Care",
          description: "Step-by-step guide to maintaining proper menstrual hygiene, choosing safe products, and preventing infections.",
          duration: "3:10",
          tags: ["Hygiene", "Care"],
          image: "/images/videos/video_2.png",
          youtubeId: "UBhiwkM8MIY"
        },
        {
          title: "Healthy Diet During Menstruation",
          description: "Discover iron-rich foods, hydration tips, and personalized nutrition plans to reduce cramps and boost energy.",
          duration: "3:40",
          tags: ["Diet", "Nutrition"],
          image: "/images/videos/video_3.png",
          youtubeId: "e6O_qYF0j-M"
        }
      ]);
      logger.info('Successfully seeded videos.');
    }
  } catch (error) {
    logger.error(`Error seeding data: ${error}`);
  }
};
