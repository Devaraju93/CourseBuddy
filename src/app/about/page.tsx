import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";


export default async function AboutUs() {
    const {isAuthenticated} =  getKindeServerSession();
    const isLoggedIn = await isAuthenticated();
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About CourseBuddy</h1>
        <p className="text-xl text-muted-foreground">
          Empowering learners through shared experiences
        </p>
      </header>

      <main className="grid gap-12">
        <section className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
            <p className="text-lg mb-6">
              At CourseBuddy, we believe in the power of shared knowledge. Our
              platform is designed to help students and lifelong learners make
              informed decisions about their educational journey by providing a
              space for honest course reviews and ratings.
            </p>
            <Button asChild>
              <Link href="/courses">Explore Courses</Link>
            </Button>
          </div>
          <div className="ml-20">
          <Image
            src="/aboutCourseImage.jpeg"
            alt="Students collaborating"
            width={400}
            height={300}
            className="rounded-lg shadow-lg"
          />
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Post Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                Users can easily share details about courses they have taken,
                providing valuable insights for others.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Write Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                Share your experiences, both positive and constructive, to help
                fellow learners make informed decisions.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Rate Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                Engage with the community by rating reviews, helping to
                highlight the most helpful feedback.
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-6">Join Our Community</h2>
          <p className="text-lg mb-8">
            Whether you are a student, educator, or lifelong learner,
            CourseBuddy is here to support your educational journey. Start
            exploring courses, sharing your experiences, and connecting with
            fellow learners today.
          </p>
          {
            !isLoggedIn && (
              <RegisterLink>
                <Button size="lg">Get Started</Button>
              </RegisterLink>
            )
          }
        </section>
      </main>
    </div>
  );
}
