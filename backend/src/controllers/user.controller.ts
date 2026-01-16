import type { Request, Response } from "express";

const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    // Mock data as requested
    // In a real app, we would fetch from User model: await User.findOne({ _id: userId })
    const mockDriver = {
      name: "John Doe",
      phone: "70 123 456",
      carModel: "Kia Picanto",
      plateNumber: "G 123456",
    };

    res.status(200).json({
      message: "User details found",
      data: mockDriver,
    });
  } catch (error) {
    console.error("Error in get user details controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { getUserDetails };
