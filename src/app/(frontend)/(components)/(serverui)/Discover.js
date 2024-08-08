import { useContext, useState, useEffect } from "react";
import ServerContext from "../../(context)/ServerContext";
import ServerCard from "./ServerCard";
import { getServers } from "../../../../api/getServers";

export default function Discover({ position, submitValue, setSubmitValue }) {
  const { servers, setServers, serverLoading, setServerLoading } =
    useContext(ServerContext);
  const [filterServerGaming, setFilterServerGaming] = useState([]);
  const [filterServerWork, setFilterServerWork] = useState([]);
  const [filteredServers, setFilteredServers] = useState([]);

  useEffect(() => {
    // console.log("Position:", position);
    // console.log("Servers:", servers);
    setFilteredServers([]);
    setSubmitValue("");

    const filterServerGaming = servers.filter(
      (server) => server.serverCategory === "Gaming"
    );
    setFilterServerGaming(filterServerGaming);

    const filterServerWork = servers.filter(
      (server) => server.serverCategory === "Work"
    );
    setFilterServerWork(filterServerWork);

    // console.log("filterServerGaming: ", filterServerGaming);
    // console.log("filterServerWork: ", filterServerWork);
  }, [servers, position]);

  useEffect(() => {
    const fetchServerData = async () => {
      setServerLoading(true);
      try {
        const { servers } = await getServers();
        setServers(servers); // Update servers state in context
        // console.log("servers: ", servers);
      } catch (error) {
        console.error("Failed to fetch servers:", error);
      } finally {
        setServerLoading(false);
      }
    };

    fetchServerData();
  }, [position]);

  useEffect(() => {
    displayServerfromSearch(submitValue);
  }, [submitValue]);

  function displayServerfromSearch(value) {
    const filteredServers = servers.filter((server) =>
      server.serverName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredServers(filteredServers);
  }

  function formatNumber(value) {
    return value.toLocaleString();
  }

  return (
    <>
      {serverLoading && (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div className="custom-scrollbar -mb-2 grid xl:grid-cols-2 grid-cols-1 grid-flow-row auto-rows-min xl:gap-10 gap-10 h-full overflow-scroll pt-10 px-5 pb-0">
        {!serverLoading &&
          servers &&
          submitValue.length > 0 &&
          filteredServers.map((e, i) => (
            <ServerCard
              key={i}
              icon={e.serverIcon}
              name={e.serverName}
              members={formatNumber(+e.members.length)}
              serverId={e._id}
              serverCategory={e.serverCategory}
            />
          ))}

        {!serverLoading &&
          servers &&
          position === "home" &&
          submitValue.length === 0 &&
          servers.map((e, i) => (
            <ServerCard
              key={i}
              icon={e.serverIcon}
              name={e.serverName}
              members={formatNumber(+e.members.length)}
              serverId={e._id}
              serverCategory={e.serverCategory}
            />
          ))}
        {!serverLoading &&
          servers &&
          position === "work" &&
          submitValue.length === 0 &&
          filterServerWork.map((e, i) => (
            <ServerCard
              key={i}
              icon={e.serverIcon}
              name={e.serverName}
              members={formatNumber(+e.members.length)}
              serverId={e._id}
              serverCategory={e.serverCategory}
            />
          ))}
        {!serverLoading &&
          servers &&
          position === "gaming" &&
          submitValue.length === 0 &&
          filterServerGaming.map((e, i) => (
            <ServerCard
              key={i}
              icon={e.serverIcon}
              name={e.serverName}
              members={formatNumber(+e.members.length)}
              serverId={e._id}
              serverCategory={e.serverCategory}
            />
          ))}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            display: none; /* Hide scrollbar for WebKit-based browsers */
          }
          .custom-scrollbar {
            -ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
            scrollbar-width: none; /* Hide scrollbar for Firefox */
          }
        `}</style>
      </div>
    </>
  );
}
