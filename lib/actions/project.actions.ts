"use server";

import { connectToDatabase } from "@/lib/database";
import { handleError } from "@/lib/utils";
import Project from "../database/models/project.model";
import { CreateProjectParams } from "@/types";
import { revalidatePath } from "next/cache";

// Projection for public listing — omit nothing for projects (small documents)
const PROJECT_LIST_PROJECTION = "title description stack image url category author";

export const createProject = async ({
  title,
  description,
  stack,
  image,
  url,
  category,
  author
}: CreateProjectParams) => {
  try {
    await connectToDatabase();
    const newProject = await Project.create({ title, description, stack, image, url, category, author });
    
    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath("/dashboard/projects");

    return JSON.parse(JSON.stringify(newProject));
  } catch (error) {
    handleError(error);
  }
};

export const getAllProjects = async () => {
  try {
    await connectToDatabase();
    const projects = await Project.find()
      .select(PROJECT_LIST_PROJECTION)
      .sort({ _id: -1 })
      .lean();
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    handleError(error);
  }
};

export const getProjectById = async (projectId: string) => {
  try {
    await connectToDatabase();
    const project = await Project.findById(projectId).lean();
    if (!project) throw new Error("Project not found");
    return JSON.parse(JSON.stringify(project));
  } catch (error) {
    handleError(error);
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    await connectToDatabase();
    const deletedProject = await Project.findByIdAndDelete(projectId);
    if (!deletedProject) throw new Error("Project not found");

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);
    revalidatePath("/dashboard/projects");

    return { message: "Project deleted successfully" };
  } catch (error) {
    handleError(error);
  }
};

export const updateProject = async (
  projectId: string,
  updateData: Partial<CreateProjectParams>
) => {
  try {
    await connectToDatabase();
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { ...updateData },
      { new: true, runValidators: true }
    );
    if (!updatedProject) throw new Error("Project not found");

    revalidatePath("/");
    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);
    revalidatePath("/dashboard/projects");

    return JSON.parse(JSON.stringify(updatedProject));
  } catch (error) {
    handleError(error);
  }
};
