import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"
import axios from 'axios';
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "react-toastify";
import { format } from "date-fns"
// import BookingForm from "./BookingForm";
// eslint-disable-next-line no-unused-vars
// import { ApprovedByAdmin, ApprovedByHod, RejectedByAdmin } from "../Steps"
// eslint-disable-next-line no-unused-vars
// import Index from "./Table";
const BookingsAdmin = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("Approved By HOD");
  const [emailVerified, setEmailVerified] = useState(false);
  const [userData, setUserData] = useState({});


  const userContact = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getdata`, {
        withCredentials: true, // include credentials in the request
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;
      //consolelog(data);
      setUserData(data)
      if (data.emailVerified) {
        setEmailVerified(true)
      }



      setIsLoading(false);

      if (response.status !== 200) {
        throw new Error(response.error);
      }
    } catch (error) {

      // //consolelog(error);

    }
  };

  useEffect(() => {
    userContact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBookingData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/bookingsAdmin`, {
        withCredentials: true, // include credentials in the request
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });

      const data = response.data;
      console.log(data);

      const sortedBookingData = data.bookings.sort((a, b) => {
        // Convert the event date strings to Date objects and compare them
        return new Date(a.eventDate) - new Date(b.eventDate);
      });

      setBookingData(sortedBookingData);

      // setBookingData(data.bookings);
      setIsLoading(false);



      // if (response.status === 401) {
      //   toast.warn("Unauthrized Access!")
      //   navigate("/login");
      //   // throw new Error(response.error);
      // }

      // if (response.status === 401) {
      //   toast.warn("Unauthrized Access!")
      //   navigate("/login");
      // } else 


      if (response.status !== 200) {

        throw new Error(response.status);
      }
    } catch (error) {
      //consolelog(error);
      if (error.response.status === 401) {
        toast.warn("Unauthrized Access! Please Login!", {
          toastId: 'Unauthrized'
        })
        navigate("/login");
      }
      // navigate("/login");
    }
  };






  useEffect(() => {

    getBookingData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // navigate(`/bookingForm/${hallId}/${hallName}`)


  const updateBooking = async (bookingId, isApproved) => {
    setIsLoading(true);

    //consolelog(isApproved);
    try {
      const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/bookingsEdit/${bookingId}`, {
        isApproved: isApproved
      }, {
        withCredentials: true, // include credentials in the request
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      });

      const data = response.data;
      //consolelog(data);


      // setBookingData(data.bookings);

      getBookingData();
      // setIsLoading(false);
      toast.success(`Request ${isApproved} Successfull!`)

      if (response.status !== 200) {

        throw new Error(response.error);
      }
    } catch (error) {

      //consolelog(error);
      // navigate("/login");
    }
  };

  // const deleteBooking = async (bookingId) => {
  //   // e.preventDefault();


  //   try {
  //     const response = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/bookings/${bookingId}`,

  //       {
  //         withCredentials: true, // To include credentials in the request
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const data = response.data;

  //     if (!data) {
  //       toast.error("Request not send!")
  //       // //consolelog("Message not send");
  //     } else {
  //       getBookingData();
  //       toast.success("Request send Successfull!")
  //       // alert("Message send");
  //       navigate("/")
  //       // setBookingData({ ...bookingData });
  //     }
  //   } catch (error) {
  //     if (error.response.status === 404 && error.response) {
  //       const data = error.response.data;
  //       //consolelog(data.error);
  //       // window.alert(data.error);
  //     } else {
  //       //consoleerror(error);
  //     }
  //     // //consolelog(error);
  //   }
  // };


  const handleFilter = (value) => {
    setFilterValue(value);
  };

  const filteredBookings = Object.values(bookingData).filter((bookingData) => {
  
    if (filterValue === "Request Sent") {
      return bookingData.isApproved === "Request Sent";
    }else if(filterValue === "Approved By HOD") {
      return bookingData.isApproved === "Approved By HOD";
    
    
    } else if (filterValue === "Approved By Admin") {
      return bookingData.isApproved === "Approved By Admin";
    } else if (filterValue === "Rejected By Admin") {
      return bookingData.isApproved === "Rejected By Admin";
    }else if (filterValue === "My Requests") {
      return bookingData.email === userData.email;
    } else {
      return bookingData
    }
  });
  
  // const hallId =userData.hallId
  // const hallName = userData.hallName

  // const handleBookingClick = (hallId,hallName) => {
  //   navigate('/bookingForm', { state: { hallId, hallName } });

  // };

  // const handleBookingClick = () => {
  //   sendData(data);
  // };
  const handleEditClick = (bookingId) => {
    navigate(`/bookingsEdit/${bookingId}`)
  };

  const handleViewClick = (bookingId) => {
    navigate(`/bookingsView/${bookingId}`)
  };
  return (
    <>
      {/* <Index /> */}

      <div className="mt-6">
        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-3xl text-center text-gray-800 font-black leading-7 ml-3 md:leading-10">
          Booking<span className="text-indigo-700"> Requests</span>  </h1>


        <div className="flex flex-wrap my-8 justify-center">
          <button
            className={`rounded-full px-4 py-2 mx-4  focus:outline-none ${filterValue === "all" ? "bg-indigo-100 text-indigo-800" : "bg-white text-gray-800 hover:bg-gray-100"}`}
            onClick={() => handleFilter("all")}
          >
            All
          </button>


          {/* <button
            className={`rounded-full px-4 py-2 mx-4 focus:outline-none ${filterValue === "Approved By HOD" ? "bg-indigo-100 text-indigo-800 " : "bg-white text-gray-800 hover:bg-gray-100"}`}
            onClick={() => handleFilter("Approved By HOD")}
          >
            Pending
          </button> */}


{process.env.REACT_APP_HOD_FEATURE === "true" ?
          <button
            className={`rounded-full px-4 py-2 mx-4 focus:outline-none ${filterValue === "Approved By HOD" ? "bg-indigo-100 text-indigo-800 " : "bg-white text-gray-800 hover:bg-gray-100"}`}
            onClick={() => handleFilter("Approved By HOD")}
          >
            Pending
          </button>
:

<button
            className={`rounded-full px-4 py-2 mx-4 focus:outline-none ${filterValue === "Request Sent" ? "bg-indigo-100 text-indigo-800 " : "bg-white text-gray-800 hover:bg-gray-100"}`}
            onClick={() => handleFilter("Request Sent")}
          >
            Pending
          </button>
}
          <button
            className={`rounded-full px-4 py-2 mx-4 focus:outline-none ${filterValue === "Approved By Admin" ? "bg-indigo-100 text-indigo-800" : "bg-white text-gray-800 hover:bg-gray-100"}`}
            onClick={() => handleFilter("Approved By Admin")}
          >
            Approved
          </button>
          <button
            className={`rounded-full px-4 py-2 mx-4 focus:outline-none ${filterValue === "Rejected By Admin" ? "bg-indigo-100 text-indigo-800" : "bg-white text-gray-800   hover:bg-gray-100"}`}
            onClick={() => handleFilter("Rejected By Admin")}
          >
            Rejected
          </button>
          <button
            className={`rounded-full px-4 py-2 mx-4 focus:outline-none ${filterValue === "My Requests" ? "bg-indigo-100 text-indigo-800" : "bg-white text-gray-800   hover:bg-gray-100"}`}
            onClick={() => handleFilter("My Requests")}
          >
            My Requests
          </button>
        </div>


        {isLoading ? (
          <LoadingSpinner />
        ) : (




          <div className="container w-full px-4 mx-auto sm:px-8 ">
              <div className="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8 ">
                <div className="inline-block min-w-full border overflow-hidden rounded-lg  shadow-xl shadow-blue-100 ">
                  <table className="min-w-full leading-normal    ">
                    <thead>
                      <tr className="bg-gray-200 border-gray-500  leading-normal  text-center">
                        <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase   border-gray-200">
                          Event Name
                        </th>
                        <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase  border-gray-200">
                          Hall Name
                        </th>
                        <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase   border-gray-200">
                          Organizing Club

                        </th>
                        <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase   border-gray-200">
                          Department
                        </th>
                        <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase   border-gray-200">
                          Event Date
                        </th>
                        <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase   border-gray-200">
                          Status
                        </th>
                        <th scope="col" className="px-4 py-3 text-l   text-gray-800 uppercase   border-gray-200">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>


                      {Array.isArray(filteredBookings) && filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                          // <div key={booking._id} className="my-2 ">

                          <tr key={booking._id} className="border-gray-200 text-center border-b-2  ">
                            <td className="px-5 py-5 font-bold text-m  bg-white  border-gray-200">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {booking.eventName}
                              </p>
                            </td>
                            <td className="px-5 py-5 text-m bg-white  border-gray-200">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {booking.bookedHallName}

                              </p>
                            </td>
                            <td className="px-5 py-5 text-m bg-white  border-gray-200">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {booking.organizingClub}
                              </p>
                            </td>
                            <td className="px-5 py-5 text-m bg-white  border-gray-200">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {booking.department}
                              </p>
                            </td>

                            <td className="px-5 py-5 text-m bg-white  border-gray-200">
                            {booking.eventDateType === "multiple" ? 
                            <p className="text-gray-900 whitespace-no-wrap ">
                              {format(new Date(booking.eventStartDate), "EEEE dd-MM-yyyy")}
                              <br/>To<br/>
                              {format(new Date(booking.eventEndDate), "EEEE dd-MM-yyyy")}

                            </p>

                            :
                            <p className="text-gray-900 whitespace-no-wrap">
                              {format(new Date(booking.eventDate), "EEEE dd-MM-yyyy")}
                            </p>

                            }
                            </td>




                            <td className="px-5 py-5 text-m bg-white  border-gray-200">

                              {booking.isApproved === "Approved By Admin" && (
                                // <ApprovedByAdmin />
                                <p className="text-green-600 font-bold whitespace-no-wrap">
                                  {booking.isApproved}
                                </p>
                                // <p className="text-m text-xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-3xl text-green-500 font-black">
                                // </p>
                              )}
                              {booking.isApproved === "Approved By HOD" && (
                                // <ApprovedByHod />
                                <p className="text-blue-600 font-bold  whitespace-no-wrap">
                                  {booking.isApproved}
                                </p>
                              )}

                              {booking.isApproved === "Request Sent" && (
                                // <ApprovedByHod />
                                <p className="text-blue-600 font-bold  whitespace-no-wrap">
                                  Pending
                                </p>
                              )}

                              {booking.isApproved === "Rejected By Admin" && (
                                <p className="text-red-900 font-bold  whitespace-no-wrap">
                                  {booking.isApproved}
                                </p>

                              )}


                            </td>


                            <td className="px-5 py-5 text-m bg-white  border-gray-200">
                              <button onClick={() => handleViewClick(booking._id)} className="text-m font-bold ml-5 leading-none text-gray-600 py-3 px-5 bg-gray-200 rounded hover:bg-gray-300 focus:outline-none">View</button>
                              <button onClick={() => handleEditClick(booking._id)}
                                className="text-m font-bold ml-5 leading-none text-gray-600 py-3 px-5 bg-yellow-200 rounded hover:bg-yellow-300  focus:outline-none">Edit</button>
                              <button
                                onClick={() => updateBooking(booking._id, "Approved By Admin")} className="text-m font-bold ml-5 leading-none text-gray-600 py-3 px-5 bg-green-200 rounded hover:bg-green-300 focus:outline-none">Approve</button>
                              <button
                                onClick={() => updateBooking(booking._id, "Rejected By Admin")} className="text-m font-bold ml-5 leading-none text-gray-600 py-3 px-5 bg-red-200 rounded hover:bg-red-300 focus:outline-none">Reject</button>
                            </td>

                          </tr>
                          // </div>
                        ))
                      ) : (

                        <tr className="border-gray-200 border-b justify-center">
                          <td className="px-5 py-5 font-bold text-m bg-white border-gray-200 text-center" colSpan="7">
                            <p className="text-gray-900 whitespace-no-wrap">
                              No Bookings Requests found.
                            </p>
                          </td>
                        </tr>


                        // <h2 className="text-2xl font-bold text-zinc-700  text-center mt-10">No Bookings Requests found.</h2>

                      )}

                    </tbody>
                  </table>
                </div>
              </div>
          </div>





        )}


      </div>



















    </>
  );
};

export default BookingsAdmin;
