<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <h1 class="app-title">EdLink Ops</h1>
          <p class="app-subtitle">Offline Inspection Suite</p>
        </div>
        <nav class="main-nav">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            active-class="active"
          >
            {{ item.label }}
          </router-link>
        </nav>
        <div class="header-actions">
          <div class="user-menu">
            <Avatar :name="userName" size="sm" />
            <button class="menu-btn" @click="showUserMenu = !showUserMenu">
              {{ userName }}
            </button>
            <div v-if="showUserMenu" class="dropdown-menu">
              <button @click="handleLogout">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="layout-container">
      <aside v-if="showSidebar" class="sidebar">
        <div class="sidebar-content">
          <div class="sidebar-section">
            <h3 class="section-title">Main</h3>
            <ul class="sidebar-menu">
              <li>
                <router-link to="/dashboard" active-class="active">
                  Dashboard
                </router-link>
              </li>
              <li>
                <router-link to="/inspections" active-class="active">
                  Inspections
                </router-link>
              </li>
              <li>
                <router-link to="/entities" active-class="active">
                  Entities
                </router-link>
              </li>
            </ul>
          </div>

          <div class="sidebar-section">
            <h3 class="section-title">Requests</h3>
            <ul class="sidebar-menu">
              <li>
                <router-link to="/action-requests" active-class="active">
                  Actions
                </router-link>
              </li>
              <li>
                <router-link to="/service-requests" active-class="active">
                  Services
                </router-link>
              </li>
              <li>
                <router-link to="/vor-requests" active-class="active">
                  VOR
                </router-link>
              </li>
            </ul>
          </div>

          <div class="sidebar-section">
            <h3 class="section-title">Settings</h3>
            <ul class="sidebar-menu">
              <li>
                <router-link to="/licenses" active-class="active">
                  Licenses
                </router-link>
              </li>
              <li>
                <router-link to="/staff" active-class="active">
                  Staff
                </router-link>
              </li>
              <li>
                <router-link to="/sync" active-class="active">
                  Sync
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <main class="main-content">
        <div class="breadcrumb-wrapper" v-if="showBreadcrumb">
          <Breadcrumb :items="breadcrumbItems" />
        </div>
        <slot />
      </main>
    </div>

    <footer class="app-footer">
      <p>&copy; 2024 EdLink. All rights reserved.</p>
      <div class="footer-links">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Support</a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';
import { Breadcrumb, Avatar } from '@/components';

interface Props {
  showSidebar?: boolean;
  showBreadcrumb?: boolean;
  breadcrumbItems?: Array<{ label: string; href: string }>;
}

withDefaults(defineProps<Props>(), {
  showSidebar: true,
  showBreadcrumb: true,
  breadcrumbItems: () => []
});

const router = useRouter();
const showUserMenu = ref(false);

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Inspections', path: '/inspections' },
  { label: 'Entities', path: '/entities' }
];

const userName = computed(() => {
  // Get from store or session
  return 'User';
});

const handleLogout = async () => {
  // Handle logout
  await router.push('/login');
};
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* Header Styles */
.app-header {
  background-color: white;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 100%;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.logo-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: fit-content;
}

.app-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.app-subtitle {
  margin: 0;
  font-size: 12px;
  color: #666;
}

.main-nav {
  display: flex;
  gap: 24px;
  flex: 1;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #007bff;
  border-bottom-color: #007bff;
}

.nav-link.active {
  color: #007bff;
  border-bottom-color: #007bff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.menu-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  color: #333;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 160px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
  z-index: 1001;
}

.dropdown-menu button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  color: #333;
  font-size: 14px;
}

.dropdown-menu button:hover {
  background-color: #f5f5f5;
}

/* Layout Container */
.layout-container {
  display: flex;
  flex: 1;
  gap: 0;
}

/* Sidebar Styles */
.sidebar {
  width: 240px;
  background-color: white;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}

.sidebar-content {
  padding: 16px 0;
}

.sidebar-section {
  margin-bottom: 24px;
}

.sidebar-section:last-child {
  margin-bottom: 0;
}

.section-title {
  margin: 0 16px 8px;
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sidebar-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar-menu li {
  margin: 0;
}

.sidebar-menu a {
  display: block;
  padding: 12px 16px;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-left: 3px solid transparent;
  transition: all 0.2s;
}

.sidebar-menu a:hover {
  background-color: #f9f9f9;
  color: #007bff;
}

.sidebar-menu a.active {
  background-color: #f0f7ff;
  color: #007bff;
  border-left-color: #007bff;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.breadcrumb-wrapper {
  margin-bottom: 24px;
}

/* Footer Styles */
.app-footer {
  background-color: white;
  border-top: 1px solid #ddd;
  padding: 32px 24px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.footer-links {
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-top: 16px;
}

.footer-links a {
  color: #007bff;
  text-decoration: none;
}

.footer-links a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .main-nav {
    display: none;
  }

  .header-content {
    padding: 0 16px;
  }

  .main-content {
    padding: 16px;
  }
}
</style>
