import React, { useState, useEffect, useRef } from "react";
import { FaTimes, FaPaperPlane, FaHire, FaFlag } from "react-icons/fa";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
