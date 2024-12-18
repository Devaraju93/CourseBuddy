import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default  async function CallToAction(){
  const {isAuthenticated} =  getKindeServerSession();
  const isLoggedIn = await isAuthenticated();
    return(
        <section className="w-full flex justify-center items-center py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Find Your Next Course?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Join thousands of learners who have found their perfect courses through CourseBuddy.
                </p>
              </div>
              {
            !isLoggedIn && (
              <div className="w-full max-w-sm space-y-2">
              <RegisterLink>
             
                <Button className="w-full" size="lg">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                </RegisterLink>
              </div>
            )
          }
            </div>
          </div>
        </section>
    )
}