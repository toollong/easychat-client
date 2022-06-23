<template>
  <!-- Archived sidebar -->
  <div id="archived" class="sidebar">
    <header>
      <span>Archived</span>
      <ul class="list-inline">
        <li class="list-inline-item d-xl-none d-inline">
          <a href="#" class="btn btn-outline-light text-danger sidebar-close">
            <i data-feather="x"></i>
          </a>
        </li>
      </ul>
    </header>
    <form>
      <input type="text" class="form-control" placeholder="Search archived" />
    </form>
    <div class="sidebar-body">
      <ul class="list-group list-group-flush users-list">
        <li class="list-group-item">
          <figure class="avatar">
            <span class="avatar-title bg-danger rounded-circle">M</span>
          </figure>
          <div class="users-list-body">
            <div>
              <h5>Mercedes Pllu</h5>
              <p>
                I know how important this file is to you. You can trust me ;)
              </p>
            </div>
            <div class="users-list-action">
              <div class="action-toggle">
                <div class="dropdown">
                  <a data-toggle="dropdown" href="#">
                    <i data-feather="more-horizontal"></i>
                  </a>
                  <div class="dropdown-menu dropdown-menu-right">
                    <a href="#" class="dropdown-item">发送消息</a>
                    <div class="dropdown-divider"></div>
                    <a href="#" class="dropdown-item text-danger">取消收藏</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  <!-- ./ Archived sidebar -->
</template>

<script>
export default {
  name: "SidebarArchived",
};
</script>

<style scoped>
</style>