import React, { useContext, useEffect } from "react";
import { Col, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { addNotifications } from "../features/userSlice";
import "./Sidebar.css";
import profile from "../assets/profile.png";
import circle from "../assets/circle.png"


function Sidebar() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { socket, setMembers, members, setCurrentRoom, setRooms, privateMemberMsg, setPrivateMemberMsg, currentRoom } = useContext(AppContext);

    function joinRoom(rooms) {
        socket.emit("join-room", rooms, currentRoom);
        setCurrentRoom(rooms);
    }

    // this is for sending message to be seen 
    socket.off("notifications").on("notifications", (room) => {
        if (currentRoom !== room) dispatch(addNotifications(room));
    });

    useEffect(() => {
        if (user) {
            setCurrentRoom("general");
            getRooms();
            socket.emit("join-room", "general");
            socket.emit("new-user");
        }
    }, []);

    socket.off("new-user").on("new-user", (payload) => {
        setMembers(payload);
    });

    function getRooms() {
        fetch("http://localhost:5001/rooms")
            .then((res) => res.json())
            .then((data) => setRooms(data));
    }

    function orderIds(id1, id2) {
        if (id1 > id2) {
            return id1 + "-" + id2;
        } else {
            return id2 + "-" + id1;
        }
    }

    function handlePrivateMemberMsg(member) {
        setPrivateMemberMsg(member);
        const roomId = orderIds(user._id, member._id);
        joinRoom(roomId);
    }

    if (!user) {
        return <></>;
    }
    return (
        <>
            <h2>Chats</h2>
            {members.map((member) => (
                <div className="box">
                    <ListGroup.Item key={member.id} style={{ cursor: "pointer" }} active={privateMemberMsg?._id === member?._id}
                        onClick={() => handlePrivateMemberMsg(member)} disabled={member._id === user._id}>
                        <Row>
                            <Col xs={2} className="member-status">
                                <img src={profile} alt="profile" className="member-status-img" />
                                {member.status === "online" ? <img src={circle} className="sidebar-online-status" alt="" /> :
                                    <img src={circle} className="sidebar-offline-status" alt="" />}
                            </Col>
                            <Col xs={9}>
                                {member.name}
                                {member._id === user?._id && " (You)"}

                            </Col>
                        </Row>
                    </ListGroup.Item>
                </div>
            ))}
        </>
    );
}

export default Sidebar;
