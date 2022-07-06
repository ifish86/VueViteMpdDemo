import { createRouter, createWebHistory } from "vue-router";

const routes = [
    {
        path: "/",
        name: "Home",
        component: () => import("@/components/viewLibrary.vue"),
        meta: {
            reload: true,
        }
    },
    {
        name: "Settings",
        path: "/settings",
        component: () => import("@/components/menuSettings.vue"),
    },
    {
        name: "Status",
        path: "/status",
        component: () => import("@/components/menuStatus.vue"),
    },
    {
        name: "Current Track",
        path: "/currentSong",
        component: () => import("@/components/menuCurrentSong.vue"),
    },
    {
        name: "Currently Playing",
        path: "/currentPlaying",
        component: () => import("@/components/viewCurrent.vue"),
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
