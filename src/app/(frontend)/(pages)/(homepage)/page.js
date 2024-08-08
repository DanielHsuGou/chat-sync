"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/typography";
import Link from "next/link";
import Feature from "@/components/ui/Feature";
import { Users, MessageCircleHeart, Handshake } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div
      className="flex flex-col h-full md:py-36 pt-11 pb-24
        w-full items-center gap-12 text-center"
    >
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center md:text-left w-full md:px-16 px-6 max-w-[1500px]">
        <motion.div
          className="flex flex-col gap-10 md:items-start"
          initial={{ opacity: 0, y: -100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <Typography className="max-w-2xl" variant="h1">
            Simple Chat Platform for easy Work and Gaming
          </Typography>
          <Typography className="max-w-2xl" variant="h5">
            Sync makes it easy to connect, share and interact with your friends
            and team.
          </Typography>
          <Link href="/chat" target="_blank">
            <Button size="lg" variant="default">
              {`Start Chatting`}
            </Button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <Image
            width={500}
            height={500}
            alt="Robot.dev robot image"
            src="/robot.png"
          />
        </motion.div>
      </div>

      <div className="flex flex-col md:pt-24 md:gap-36 gap-24 items-center w-full">
        <motion.div
          className="flex flex-col gap-12 items-center justify-center w-full py-24 md:px-16 px-6 text-white bg-blue-500"
          initial={{ opacity: 0, x: -200, y: -50 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <Typography className="max-w-2xl" variant="h1">
              Quick conversation
              <br />
              Less stress
            </Typography>
          </motion.div>
          <div className="flex md:flex-row flex-col gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeInOut" }}
              viewport={{ once: true }}
            >
              <Feature
                icon={<MessageCircleHeart size={24} />}
                headline="Chat"
                description="Exchange messages, share files, and engage in lively discussions."
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: "easeInOut" }}
              viewport={{ once: true }}
            >
              <Feature
                icon={<Handshake size={24} />}
                headline="Friends"
                description="Personalize a vibrant network of trusted contacts, from work colleagues to gaming enthusiasts."
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6, ease: "easeInOut" }}
              viewport={{ once: true }}
            >
              <Feature
                icon={<Users size={24} />}
                headline="Community"
                description="Create an engaging experience for work teams and gaming communities."
              />
            </motion.div>
          </div>
        </motion.div>

        <div className="flex flex-col justify-between md:flex-row gap-6 items-center md:text-left w-full md:px-16 px-6 max-w-[1500px]">
          <motion.div
            className="flex-col w-xl lg:ml-24 md:hidden flex mb-5"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <Typography className="max-w-2xl" variant="h2">
              Instant chat with anyone
            </Typography>
            <Typography className="max-w-2xl" variant="h5">
              Click on direct messages and find someone you know to chat with.
            </Typography>
          </motion.div>
          <img
            src="/home_feature.png"
            alt="Sync.dev feature image"
            className="rounded-[36px] md:w-[60%] w-[95%]"
          />
          <motion.div
            className="flex-col w-xl lg:ml-24 md:flex hidden"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <Typography className="max-w-2xl" variant="h2">
              Instant chat with anyone
            </Typography>
            <Typography className="max-w-2xl" variant="h5">
              Click on direct messages and find someone you know to chat with.
            </Typography>
          </motion.div>
        </div>

        <div className="rounded-[64px] bg-blue-500 flex flex-col justify-between md:flex-row gap-6 items-center md:text-left w-[95%] p-5 border-white border-8 max-w-[1500px]">
          <motion.div
            className="flex-col w-xl m-5 text-white"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeInOut" }}
            viewport={{ once: true }}
          >
            <Typography className="max-w-2xl" variant="h2">
              Chat in the community
            </Typography>
            <Typography className="max-w-2xl" variant="h5">
              Join servers and participate in group chats.
            </Typography>
          </motion.div>
          <img
            alt="Sync.dev feature image"
            src="/home_feature_2.png"
            className="rounded-[36px] md:w-[60%] w-full"
          />
        </div>

        <motion.div
          className="flex flex-col lg:flex-row items-center justify-start w-auto"
          initial={{ opacity: 0, y: -100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeInOut" }}
          viewport={{ once: true }}
        >
          <Image
            width={600}
            height={600}
            alt="Sync.dev chat image"
            src="/chat_icon.gif"
            className="max-w-[900px] lg:mb-0 lg:mr-10 xl:w-[60%] lg:w-[70%] md:w-[80%] w-[90%] mb-10 mr-0"
            unoptimized
          />
          <Link href="/chat" target="_blank" className=" w-full">
            <Button
              size="round"
              variant="solid"
              className="text-blue-600 text-xl"
            >
              {`Start Chatting Now`}
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
