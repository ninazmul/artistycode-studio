"use server";

import { connectToDatabase } from "@/lib/database";
import { handleError } from "@/lib/utils";
import Project from "../database/models/project.model";
import { CreateProjectParams } from "@/types";

export const createProject = async ({
  title,
  description,
  stack,
  image,
  url,
  category,
}: CreateProjectParams) => {
  try {
    await connectToDatabase();

    const newAdmin = await Project.create({
      title,
      description,
      stack,
      image,
      url,
      category,
    });

    return JSON.parse(JSON.stringify(newAdmin));
  } catch (error) {
    handleError(error);
  }
};

export const getAllProjects = async () => {
  try {
    await connectToDatabase();

    const projects = await Project.find().sort({ _id: -1 });

    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    handleError(error);
  }
};

export const getProjectById = async (projectId: string) => {
  try {
    await connectToDatabase();

    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    return JSON.parse(JSON.stringify(project));
  } catch (error) {
    handleError(error);
  }
};

export const deleteProject = async (projectId: string) => {
  try {
    await connectToDatabase();

    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      throw new Error("Project not found");
    }

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

    if (!updatedProject) {
      throw new Error("Project not found");
    }

    return JSON.parse(JSON.stringify(updatedProject));
  } catch (error) {
    handleError(error);
  }
};
