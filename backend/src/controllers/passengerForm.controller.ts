import PassengerForm from "../models/PassengerForm";
import { Request, Response } from "express";
import {
  SubmitRequestType,
  UpdateRequestType,
} from "../types/passengerFormTypes";

export const submitForm = async (req: Request, res: Response) => {
  try {
    const {
      dayCardId,
      fullName,
      phoneNumber,
      livingPlace,
      desiredTime,
      passengerCount,
    }: SubmitRequestType = req.body;
    const userId = req.user?._id;

    if (
      !dayCardId ||
      !userId ||
      !fullName ||
      !phoneNumber ||
      !livingPlace ||
      !desiredTime ||
      !passengerCount
    ) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "All fields are required",
      });
    }

    const newForm = await PassengerForm.create({
      dayCardId,
      userId,
      fullName,
      phoneNumber,
      livingPlace,
      desiredTime,
      passengerCount,
    });

    res.status(201).json({
      message: "Passenger form submitted successfully",
      formId: newForm._id,
    });
  } catch (error) {
    console.error("Passenger form submission error:", error);
    res.status(500).json({
      message: "Failed to submit passenger form",
    });
  }
};

export const updateForm = async (req: Request, res: Response) => {
  try {
    const {
      formId,
      fullName,
      phoneNumber,
      livingPlace,
      desiredTime,
      passengerCount,
    }: UpdateRequestType = req.body;
    const userId = req.user?._id;

    if (!formId || !userId) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "All fields are required",
      });
    }

    const updatedForm = await PassengerForm.findByIdAndUpdate(formId, {
      fullName,
      phoneNumber,
      livingPlace,
      desiredTime,
      passengerCount,
    });

    if (!updatedForm) {
      return res.status(404).json({
        state: "NOT_FOUND",
        message: "Passenger form not found",
      });
    }

    res.status(200).json({
      message: "Passenger form updated successfully",
      formId: updatedForm._id,
    });
  } catch (error) {
    console.error("Passenger form update error:", error);
    res.status(500).json({
      message: "Failed to update passenger form",
    });
  }
};

export const deleteForm = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;

    if (!formId) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "All fields are required",
      });
    }

    const deletedForm = await PassengerForm.findByIdAndDelete(formId);

    if (!deletedForm) {
      return res.status(404).json({
        state: "NOT_FOUND",
        message: "Passenger form not found",
      });
    }

    res.status(200).json({
      message: "Passenger form deleted successfully",
    });
  } catch (error) {
    console.error("Passenger form deletion error:", error);
    res.status(500).json({
      message: "Failed to delete passenger form",
    });
  }
};

export const isFormExists = async (req: Request, res: Response) => {
  try {
    const { dayCardId } = req.params;
    const userId = req.user?._id; // from auth middleware

    if (!dayCardId) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "dayCardId is required",
      });
    }

    const existingForm = await PassengerForm.findOne({
      dayCardId,
      userId,
    });

    return res.status(200).json({
      exists: !!existingForm,
      data: existingForm || null,
    });
  } catch (error) {
    console.error("Form existence check error:", error);
    return res.status(500).json({
      message: "Failed to check form submission status",
    });
  }
};

export const getForms = async (req: Request, res: Response) => {
  try {
    const { dayCardId } = req.params;

    if (!dayCardId) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "All fields are required",
      });
    }

    const forms = await PassengerForm.find({ dayCardId: dayCardId });

    res.status(200).json({
      message: "Passenger forms fetched successfully",
      data: forms,
    });
  } catch (error) {
    console.error("Passenger forms fetch error:", error);
    res.status(500).json({
      message: "Failed to fetch passenger forms",
    });
  }
};

export const getFormById = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;

    if (!formId) {
      return res.status(400).json({
        state: "MISSING_FIELDS",
        message: "All fields are required",
      });
    }

    const form = await PassengerForm.findById(formId);

    if (!form) {
      return res.status(404).json({
        state: "NOT_FOUND",
        message: "Passenger form not found",
      });
    }

    res.status(200).json({
      message: "Passenger form fetched successfully",
      data: form,
    });
  } catch (error) {
    console.error("Passenger form fetch error:", error);
    res.status(500).json({
      message: "Failed to fetch passenger form",
    });
  }
};

export default {
  submitForm,
  updateForm,
  deleteForm,
  getForms,
  getFormById,
  isFormExists,
};
