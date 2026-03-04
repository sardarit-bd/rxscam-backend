import User from "../../models/User.js";


const getAllUsers = async (req, res) => {

  try {
    const users = await User.find();
    res.json({
      success: true,
      message: "All Users fetched successfully",
      data: users
    });

  } catch (error) {
    res.status(500).json({ message: "There was a Server Error" });
  }

};


const getUser = async (req, res) => {


  const { id } = req.params;


  try {

    const users = await User.findById(id).select("-password").lean();
    res.json({
      success: true,
      message: "User fetched successfully",
      data: users
    });
  } catch (error) {

    res.status(500).json({ message: "There was a Server Error" });

  }


};





const updateUser = async (req, res) => {

  const { id } = req.params;


  try {

    const users = await User.findByIdAndUpdate(id, req.body, { new: true });

    res.json({
      success: true,
      message: "User updated successfully",
      data: users
    });
  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "There was a Server Error" });

  }

};




/*********** modules export from here ************/
export {
  getAllUsers,
  getUser,
  updateUser
};

