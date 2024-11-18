/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import prisma from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

export type State = {
  status: "error" | "success" | undefined;
  errors?: {
    [key: string]: string[];
  };
  message?: string | null;
};

const PostReviewSchema = z.object({
  name: z.string().min(3, { message: "Name is too short (min 3 characters)" }),
  description: z
    .string()
    .min(3, { message: "Description is too short (min 3 characters)" })
    .max(2500, { message: "Description is too big" }),
  category: z.string().min(1, { message: "Category is required" }),
  image: z.string().min(1, { message: "Image is required" }),
  rating: z
    .number()
    .min(1, { message: "Rating is required" })
    .max(5, { message: "Rating is too big" }),
});

export async function PostReview(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const parsedData = PostReviewSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    rating: Number(formData.get("rating")),
    image: formData.get("image"),
  });

  if (!parsedData.success) {
    const state: State = {
      status: "error",
      errors: parsedData.error.flatten().fieldErrors,
      message: "Oops, I think there is a mistake with your inputs.",
    };

    return state;
  }

  await prisma.$transaction(async (prisma) => {
    const review = await prisma.review.create({
      data: {
        coursename: parsedData.data.name,
        coursedescription: parsedData.data.description,
        category: parsedData.data.category,
        userId: user.id,
        courseimage: parsedData.data.image,
      },
    });

    await prisma.rating.create({
      data: {
        reviewId: review.id,
        userId: user.id,
        ratingValue: parsedData.data.rating,
      },
    });
  });

  return redirect("/reviews");
}

export async function GetReviews(searchParams: Record<string, string>) {
  const { page, query } = searchParams;

  const filters: any = {};
  if (query) {
    filters.OR = [
      { category: { contains: query, mode: "insensitive" } },
      { coursename: { contains: query, mode: "insensitive" } },
    ];
  }

  const [count, reviews, avgRatings] = await prisma.$transaction([
    prisma.review.count({
      where: filters,
    }),
    prisma.review.findMany({
      where: filters,
      take: 10,
      skip: page ? (Number(page) - 1) * 10 : 0,
      select: {
        id: true,
        coursename: true,
        coursedescription: true,
        category: true,
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.rating.groupBy({
      by: ["reviewId"],
      _avg: {
        ratingValue: true,
      },
      orderBy: {
        reviewId: "asc",
      },
    }),
  ]);

  const reviewsWithAvgRating = reviews.map((review) => {
    const avgRatingEntry = avgRatings.find((r) => r.reviewId === review.id);
    const avgRating = avgRatingEntry?._avg?.ratingValue ?? 0;

    return {
      ...review,
      averageRating: avgRating,
    };
  });

  return {count,reviewsWithAvgRating};
}

export async function GetReview(reviewId: string) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) {
    return redirect("/api/auth/login");
  }

  const [review, averageRating] = await prisma.$transaction([
    prisma.review.findUnique({
      where: {
        id: reviewId,
      },
      select: {
        id: true,
        coursename: true,
        coursedescription: true,
        category: true,
        createdAt: true,
        user: {
          select: {
            firstname: true,
            lastname: true,
            profilepic: true,
          },
        },
      },
    }),
    prisma.rating.aggregate({
      where: {
        reviewId: reviewId,
      },
      _avg: {
        ratingValue: true,
      },
    }),
  ]);

  const reviewWithAvgRating = {
    ...review,
    averageRating: averageRating._avg.ratingValue,
  };

  return reviewWithAvgRating;
}

export async function PostRating(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const reviewId = formData.get("reviewId") as string;
  const ratingValue = Number(formData.get("rating")) as number;

  await prisma.rating.create({
    data: {
      reviewId: reviewId,
      userId: user.id,
      ratingValue: ratingValue,
    },
  });
}