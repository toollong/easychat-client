<template>
  <div
    class="modal fade"
    id="settingModal"
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
  >
    <div
      class="modal-dialog modal-dialog-centered modal-dialog-zoom"
      role="document"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i data-feather="settings" class="mr-2"></i> Settings
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <i class="ti-close"></i>
          </button>
        </div>
        <div class="modal-body">
          <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item">
              <a
                class="nav-link active"
                data-toggle="tab"
                href="#account"
                role="tab"
                aria-controls="account"
                aria-selected="true"
                >Account</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                data-toggle="tab"
                href="#notification"
                role="tab"
                aria-controls="notification"
                aria-selected="false"
                >Notification</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                data-toggle="tab"
                href="#contact"
                role="tab"
                aria-controls="contact"
                aria-selected="false"
                >Security</a
              >
            </li>
          </ul>
          <div class="tab-content">
            <div class="tab-pane show active" id="account" role="tabpanel">
              <div class="form-item custom-control custom-switch">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  checked
                  id="customSwitch1"
                />
                <label class="custom-control-label" for="customSwitch1"
                  >Allow connected contacts</label
                >
              </div>
              <div class="form-item custom-control custom-switch">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  checked
                  id="customSwitch2"
                />
                <label class="custom-control-label" for="customSwitch2"
                  >Confirm message requests</label
                >
              </div>
              <div class="form-item custom-control custom-switch">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  checked
                  id="customSwitch3"
                />
                <label class="custom-control-label" for="customSwitch3"
                  >Profile privacy</label
                >
              </div>
              <div class="form-item custom-control custom-switch">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="customSwitch4"
                />
                <label class="custom-control-label" for="customSwitch4"
                  >Developer mode options</label
                >
              </div>
              <div class="form-item custom-control custom-switch">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  checked
                  id="customSwitch5"
                />
                <label class="custom-control-label" for="customSwitch5"
                  >Two-step security verification</label
                >
              </div>
            </div>
            <div class="tab-pane" id="notification" role="tabpanel">
              <div class="form-item custom-control custom-switch">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  checked
                  id="customSwitch6"
                />
                <label class="custom-control-label" for="customSwitch6"
                  >Allow mobile notifications</label
                >
              </div>
              <div class="form-item custom-control custom-switch">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="customSwitch7"
                />
                <label class="custom-control-label" for="customSwitch7"
                  >Notifications from your friends</label
                >
              </div>
              <div class="form-item custom-control custom-switch">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="customSwitch8"
                />
                <label class="custom-control-label" for="customSwitch8"
                  >Send notifications by email</label
                >
              </div>
            </div>
            <div class="tab-pane" id="contact" role="tabpanel">
              <div class="form-item custom-control custom-switch">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="customSwitch9"
                />
                <label class="custom-control-label" for="customSwitch9"
                  >Suggest changing passwords every month.</label
                >
              </div>
              <div class="form-item custom-control custom-switch">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  checked
                  id="customSwitch10"
                />
                <label class="custom-control-label" for="customSwitch10"
                  >Let me know about suspicious entries to your account</label
                >
              </div>
              <div class="form-item">
                <p>
                  <a
                    class="btn btn-light"
                    data-toggle="collapse"
                    href="#collapseExample"
                    role="button"
                    aria-expanded="false"
                    aria-controls="collapseExample"
                  >
                    <i data-feather="plus" class="mr-2"></i> Security Questions
                  </a>
                </p>
                <div class="collapse" id="collapseExample">
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Question 1"
                    />
                  </div>
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Answer 1"
                    />
                  </div>
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Question 2"
                    />
                  </div>
                  <div class="form-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Answer 2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Settings",
};
</script>

<style scoped>
</style>