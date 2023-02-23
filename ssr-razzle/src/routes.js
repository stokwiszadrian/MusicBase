import AlbumDetails from "./AlbumDetails";
import AlbumList from "./AlbumList";
import Home from "./Home";

const routes = [
    {
        path: "/home",
        component: Home, 
        exact: true
    },
    {
        path: "/home/entries",
        component: AlbumList, 
        exact: true
    },
    {
        path: "/home/entries/:id",
        component: AlbumDetails
    }
]

export default routes;