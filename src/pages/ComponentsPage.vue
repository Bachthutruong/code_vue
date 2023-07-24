<template>
  <div
    class="q-pa-xl"
    id="upId"
  >
    <div class="q-gutter-sm box-fixed-top">
      <q-checkbox
        v-for="(_, key) in action"
        :key="key"
        v-model="action[key]"
        :label="key"
        color="primary"
      />
    </div>
    <q-card
      v-if="action.text"
      class="my-card"
    >
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Typography</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <p class="text-h1">Heading 1</p>
        <p class="text-h2">Heading 2</p>
        <p class="text-h3">Heading 3</p>
        <p class="text-h3-regular">Heading 3 Regular</p>
        <p class="text-h4">Heading 4</p>
        <p class="text-h5-bold">Heading 5 Bold</p>
        <p class="text-h5">Heading 5</p>
        <p class="text-h5-regular">Heading 5 Regular</p>
        <p class="text-body-bold">Body Bold</p>
        <p class="text-body">Body</p>
        <p class="text-body-regular">Body Regular</p>
        <p class="text-body text-line-through">Body Strikethrough</p>
        <p class="text-body-regular text-line-through">Body Regular Strikethrough</p>
        <p class="text-caption">Caption</p>
      </q-card-section>
    </q-card>

    <q-card
      v-if="action.button"
      class="my-card"
    >
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Button</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-h4 q-mb-sm">Large</div>
        <div class="row q-mb-md">
          <div class="col text-caption">Primary</div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              size="large"
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              size="large"
              disable
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              icon="bi-person-add"
              size="large"
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              icon="bi-person-add"
              size="large"
              disable
            />
          </div>
        </div>
        <div class="row q-mb-md">
          <div class="col text-caption">Secondary</div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              outline
              size="large"
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              outline
              size="large"
              disable
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              outline
              icon="bi-person-add"
              size="large"
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              icon="bi-person-add"
              outline
              disable
              size="large"
            />
          </div>
        </div>
        <div class="row q-mb-md">
          <div class="col text-caption">Negative</div>
          <div class="col">
            <c-btn
              label="Button"
              color="negative"
              outline
              size="large"
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="negative"
              outline
              disable
              size="large"
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="negative"
              outline
              icon="bi-person-add"
              size="large"
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="negative"
              icon="bi-person-add"
              outline
              disable
              size="large"
            />
          </div>
        </div>
        <div class="text-h4 q-mb-sm">Medium</div>
        <div class="row q-mb-md">
          <div class="col text-caption">Primary</div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              disable
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              icon="bi-person-add"
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              icon="bi-person-add"
              disable
            />
          </div>
        </div>
        <div class="row q-mb-md">
          <div class="col text-caption">Secondary</div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              outline
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              outline
              disable
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              outline
              icon="bi-person-add"
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              icon="bi-person-add"
              outline
              disable
            />
          </div>
        </div>
        <div class="row q-mb-md">
          <div class="col text-caption">Negative</div>
          <div class="col">
            <c-btn
              label="Button"
              color="negative"
              outline
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="negative"
              outline
              disable
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="negative"
              outline
              icon="bi-person-add"
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="negative"
              icon="bi-person-add"
              outline
              disable
            />
          </div>
        </div>
        <div class="text-h4 q-mb-sm">Small</div>
        <div class="row q-mb-md">
          <div class="col text-caption">Primary</div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              size="small"
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              size="small"
              disable
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              icon="bi-person-add"
              size="small"
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              icon="bi-person-add"
              size="small"
              disable
            />
          </div>
        </div>
        <div class="row q-mb-md">
          <div class="col text-caption">Secondary</div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              outline
              size="small"
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              outline
              size="small"
              disable
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              outline
              icon="bi-person-add"
              size="small"
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="primary"
              icon="bi-person-add"
              outline
              disable
              size="small"
            />
          </div>
        </div>
        <div class="row q-mb-md">
          <div class="col text-caption">Negative</div>
          <div class="col">
            <c-btn
              label="Button"
              color="negative"
              outline
              size="small"
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="negative"
              outline
              disable
              size="small"
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="negative"
              outline
              icon="bi-person-add"
              size="small"
            />
          </div>
          <div class="col">
            <c-btn
              label="Button"
              color="negative"
              icon="bi-person-add"
              outline
              disable
              size="small"
            />
          </div>
        </div>
        <div class="text-h4 q-mb-sm">Round Large</div>
        <div class="row q-mb-md">
          <div class="col text-caption">Primary</div>
          <div class="col">
            <c-btn
              color="primary"
              size="large"
              icon="bi-person-add"
              round
            />
          </div>
          <div class="col">
            <c-btn
              icon="bi-person-add"
              color="primary"
              size="large"
              disable
              round
            />
          </div>
          <div class="col">
            <c-btn
              color="primary"
              icon="bi-person-add"
              size="large"
              round
            />
          </div>
          <div class="col">
            <c-btn
              color="primary"
              icon="bi-person-add"
              size="large"
              disable
              round
            />
          </div>
        </div>
        <div class="row q-mb-md">
          <div class="col text-caption">Secondary</div>
          <div class="col">
            <c-btn
              icon="bi-person-add"
              color="primary"
              outline
              size="large"
              round
            />
          </div>
          <div class="col">
            <c-btn
              icon="bi-person-add"
              color="primary"
              outline
              size="large"
              disable
              round
            />
          </div>
          <div class="col">
            <c-btn
              color="primary"
              outline
              icon="bi-person-add"
              size="large"
              round
            />
          </div>
          <div class="col">
            <c-btn
              color="primary"
              icon="bi-person-add"
              outline
              disable
              size="large"
              round
            />
          </div>
        </div>
        <div class="row q-mb-md">
          <div class="col text-caption">Negative</div>
          <div class="col">
            <c-btn
              icon="bi-person-add"
              color="negative"
              outline
              size="large"
              round
            />
          </div>
          <div class="col">
            <c-btn
              icon="bi-person-add"
              color="negative"
              outline
              disable
              size="large"
              round
            />
          </div>
          <div class="col">
            <c-btn
              icon="bi-person-add"
              color="negative"
              outline
              size="large"
              round
            />
          </div>
          <div class="col">
            <c-btn
              color="negative"
              icon="bi-person-add"
              outline
              disable
              size="large"
              round
            />
          </div>
        </div>
        <div class="text-h4 q-mb-sm">Round Medium</div>
        <div class="row q-mb-md">
          <div class="col text-caption">Primary</div>
          <div class="col">
            <c-btn
              color="primary"
              icon="bi-person-add"
              round
            />
          </div>
          <div class="col">
            <c-btn
              icon="bi-person-add"
              color="primary"
              disable
              round
            />
          </div>
          <div class="col">
            <c-btn
              color="primary"
              icon="bi-person-add"
              round
            />
          </div>
          <div class="col">
            <c-btn
              color="primary"
              icon="bi-person-add"
              disable
              round
            />
          </div>
        </div>
        <div class="row q-mb-md">
          <div class="col text-caption">Secondary</div>
          <div class="col">
            <c-btn
              icon="bi-person-add"
              color="primary"
              outline
              roundgri
            />
          </div>
          <div class="col">
            <c-btn
              icon="bi-person-add"
              color="primary"
              outline
              disable
              round
            />
          </div>
          <div class="col">
            <c-btn
              color="primary"
              outline
              icon="bi-person-add"
              round
            />
          </div>
          <div class="col">
            <c-btn
              color="primary"
              icon="bi-person-add"
              outline
              disable
              round
            />
          </div>
        </div>
        <div class="row q-mb-md">
          <div class="col text-caption">Negative</div>
          <div class="col">
            <c-btn
              icon="bi-person-add"
              color="negative"
              outline
              round
            />
          </div>
          <div class="col">
            <c-btn
              icon="bi-person-add"
              color="negative"
              outline
              disable
              round
            />
          </div>
          <div class="col">
            <c-btn
              icon="bi-person-add"
              color="negative"
              outline
              round
            />
          </div>
          <div class="col">
            <c-btn
              color="negative"
              icon="bi-person-add"
              outline
              disable
              round
            />
          </div>
        </div>
        <div class="text-h4 q-mb-sm">Round Small</div>
        <div class="row q-mb-md">
          <div class="col text-caption">Primary</div>
          <div class="col">
            <c-btn
              color="primary"
              icon="bi-person-add"
              size="small"
              round
            />
          </div>
          <div class="col">
            <c-btn
              icon="bi-person-add"
              color="primary"
              disable
              size="small"
              round
            />
          </div>
          <div class="col">
            <c-btn
              color="primary"
              icon="bi-person-add"
              size="small"
              round
            />
          </div>
          <div class="col">
            <c-btn
              color="primary"
              icon="bi-person-add"
              disable
              size="small"
              round
            />
          </div>
        </div>
        <div class="row q-mb-md">
          <div class="col text-caption">Secondary</div>
          <div class="col">
            <c-btn
              icon="bi-person-add"
              color="primary"
              outline
              size="small"
              round
            />
          </div>
          <div class="col">
            <c-btn
              icon="bi-person-add"
              color="primary"
              outline
              disable
              size="small"
              round
            />
          </div>
          <div class="col">
            <c-btn
              color="primary"
              outline
              icon="bi-person-add"
              size="small"
              round
            />
          </div>
          <div class="col">
            <c-btn
              color="primary"
              icon="bi-person-add"
              outline
              disable
              size="small"
              round
            />
          </div>
        </div>
        <div class="row q-mb-md">
          <div class="col text-caption">Negative</div>
          <div class="col">
            <c-btn
              icon="bi-person-add"
              color="negative"
              outline
              size="small"
              round
            />
          </div>
          <div class="col">
            <c-btn
              icon="bi-person-add"
              color="negative"
              outline
              disable
              size="small"
              round
            />
          </div>
          <div class="col">
            <c-btn
              icon="bi-person-add"
              color="negative"
              outline
              size="small"
              round
            />
          </div>
          <div class="col">
            <c-btn
              color="negative"
              icon="bi-person-add"
              outline
              disable
              size="small"
              round
            />
          </div>
        </div>
        <div class="text-h4 q-mb-sm">Text Button</div>
        <div class="row q-mb-md">
          <div class="col text-caption">Primary</div>
          <div class="col">
            <c-btn
              label="filter"
              color="primary"
              flat
            />
          </div>
          <div class="col">
            <c-btn
              label="filter"
              color="primary"
              disable
              flat
            />
          </div>
          <div class="col">
            <c-btn
              label="filter"
              color="primary"
              icon="bi-funnel"
              flat
            />
          </div>
          <div class="col">
            <c-btn
              label="filter"
              color="primary"
              icon="bi-funnel"
              disable
              flat
            />
          </div>
        </div>
        <div class="row q-mb-md">
          <div class="col text-caption">Negative</div>
          <div class="col">
            <c-btn
              label="filter"
              color="negative"
              flat
            />
          </div>
          <div class="col">
            <c-btn
              label="filter"
              color="negative"
              disable
              flat
            />
          </div>
          <div class="col">
            <c-btn
              label="filter"
              color="negative"
              icon="bi-funnel"
              flat
            />
          </div>
          <div class="col">
            <c-btn
              label="filter"
              color="negative"
              icon="bi-funnel"
              disable
              flat
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-card
      v-if="action.textField"
      class="my-card"
    >
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">text field</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-h4 q-mb-sm">Without icon</div>
        <div class="row q-mb-md">
          <div class="col">
            <c-text-field
              v-model="inputValue"
              label="Label"
            />
          </div>
          <div class="col q-pl-sm">
            <c-text-field
              v-model="inputValue"
              label="Label"
            />
          </div>
          <div class="col q-pl-sm">
            <c-text-field
              v-model="inputValue"
              label="Label"
              error-message="This is error message"
            />
          </div>
          <div class="col q-pl-sm">
            <c-text-field
              v-model="inputValue"
              label="Label"
              disable
            />
          </div>
        </div>
        <div class="text-h4 q-mb-sm">Icon</div>
        <div class="row q-mb-md">
          <div class="col">
            <c-text-field
              v-model="inputValue2"
              label="Label"
              prepend-icon="bi-calendar-event"
              @icon-click="iconClick"
            />
          </div>
          <div class="col q-pl-sm">
            <c-text-field
              v-model="inputValue2"
              label="Label"
            >
              <template v-slot:prepend>
                <q-icon name="mail" />
              </template>
            </c-text-field>
          </div>
          <div class="col q-pl-sm">
            <c-text-field
              v-model="inputValue2"
              label="Label"
              append-icon="bi-calendar-event"
            />
          </div>
          <div class="col q-pl-sm">
            <c-text-field
              v-model="inputValue2"
              label="Label"
            >
              <template v-slot:append>
                <q-icon name="mail" />
              </template>
            </c-text-field>
          </div>
        </div>
        <div class="text-h4 q-mb-sm">Calendar</div>
        <div class="row q-mb-md">
          <div class="col">
            <c-date-picker
              v-model="inputValue3"
              label="Label"
            />
          </div>
          <div class="col q-pl-sm">
            <c-date-picker
              v-model="inputValue3"
              label="Label"
            />
          </div>
          <div class="col q-pl-sm">
            <c-date-picker
              v-model="inputValue3"
              error-message="This is error message"
              label="Label"
            />
          </div>
          <div class="col q-pl-sm">
            <c-date-picker
              v-model="inputValue1"
              disable
              label="Label"
            />
          </div>
        </div>
        <div class="row q-mb-md">
          <div class="col">
            <CDateTimePicker
              v-model="inputValue6"
              label="Label"
            />
          </div>
          <div class="col q-pl-sm">
            <CDateTimePicker
              v-model="inputValue6"
              label="Label"
            />
          </div>
          <div class="col q-pl-sm">
            <CDateTimePicker
              v-model="inputValue6"
              error-message="This is error message"
              label="Label"
            />
          </div>
          <div class="col q-pl-sm">
            <CDateTimePicker
              v-model="inputValue6"
              disable
              label="Label"
            />
          </div>
        </div>
        <div class="text-h4 q-mb-sm">Password</div>
        <div class="row q-mb-md">
          <div class="col">
            <c-text-field
              v-model="inputValue4"
              label="Password"
              :type="isPassword ? 'password' : 'text'"
              :append-icon="isPassword ? 'bi-eye-slash' : 'bi-eye'"
              iconPointer
              @icon-click="changePasswordType"
            />
          </div>
          <div class="col q-pl-sm">
            <c-text-field
              v-model="inputValue4"
              label="Password"
              :type="isPassword ? 'password' : 'text'"
              :append-icon="isPassword ? 'bi-eye-slash' : 'bi-eye'"
              iconPointer
              @icon-click="changePasswordType"
            />
          </div>
          <div class="col q-pl-sm">
            <c-text-field
              v-model="inputValue4"
              label="Password"
              :type="isPassword ? 'password' : 'text'"
              :append-icon="isPassword ? 'bi-eye-slash' : 'bi-eye'"
              iconPointer
              error-message="This is error message"
              @icon-click="changePasswordType"
            />
          </div>
          <div class="col q-pl-sm">
            <c-text-field
              v-model="inputValue4"
              label="Password"
              :type="isPassword ? 'password' : 'text'"
              :append-icon="isPassword ? 'bi-eye-slash' : 'bi-eye'"
              disable
              @icon-click="changePasswordType"
            />
          </div>
        </div>
        <div class="text-h4 q-mb-sm">Text area</div>
        <div class="row q-mb-md">
          <div class="col">
            <c-text-area
              v-model="inputValue5"
              label="Text area"
              max-length="10"
            />
          </div>
          <div class="col q-pl-sm">
            <c-text-area
              v-model="inputValue5"
              label="Text area"
              max-length="10"
            />
          </div>
          <div class="col q-pl-sm">
            <c-text-area
              v-model="inputValue5"
              label="Text area"
              error-message="This is error message"
              max-length="10"
            />
          </div>
          <div class="col q-pl-sm">
            <c-text-area
              v-model="inputValue5"
              label="Text area"
              disable
              max-length="10"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
    <div v-if="action.form">
      <div
        v-for="(cardItem, index) in formChannelInfo"
        :key="index"
      >
        <CardChannel :formChannelInfo="cardItem"></CardChannel>
        <pre>
      {{ cardItem }}
      </pre
        >
      </div>
      <div
        v-for="(cardStatus, index) in formStatus"
        :key="index"
      >
        <CardStatus :formStatus="cardStatus" />
        <pre>
      {{ cardStatus }}
      </pre
        >
      </div>

      <div
        v-for="(comment, index) in formComment"
        :key="index"
      >
        <CardComment :formComment="comment">
          <template #reply>
            <CardComment
              v-for="(reply, i) in comment.children"
              :key="i"
              :formComment="reply"
            />
          </template>
        </CardComment>
        <pre>
      {{ cardComment }}
      </pre
        >
      </div>
    </div>
    <div v-if="action.notify">
      <c-btn
        label="showNotify"
        color="negative"
        @click="handleShowNotify"
      />
      <CNotify
        v-model="showNotify"
        :formNotifys="formNotify"
      />

      <pre>
      {{ formNotify }}
      </pre>
    </div>

    <q-card
      v-if="action.upload"
      class="my-card"
    >
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Upload</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-h4 q-mb-sm">Upload MultipleFile</div>
        <div class="row q-mb-md">
          <div class="col">
            <c-upload
              multiple
              showTitle
              @get-file-before="getFileBefore"
              @get-file="getFile"
            >
              <template #action="{ handleUpload }">
                <div class="uploads">
                  <div v-if="!files?.length">{{ $t('upload.rules') }}</div>
                  <div v-else>
                    {{
                      $t('upload.totalUploaded', {
                        count: files.length,
                      })
                    }}
                  </div>
                </div>
                <c-btn
                  label="Upload from computer"
                  icon="bi-upload"
                  color="primary"
                  outline
                  size="small"
                  @click="handleUpload"
                />
              </template>
            </c-upload>
            <div
              v-for="(item, index) in files"
              :key="index"
              class="flex"
            >
              <card-file-upload
                :default-files="item"
                @removeFile="removeFile"
              />
              <pre>{{ item }}</pre>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card
      v-if="action.comment"
      class="my-card"
    >
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Comment</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-h4 q-mb-sm">Comment</div>
        <div class="row q-mb-md">
          <div class="col">
            <div class="pb-2">
              <div>{{ comment }}</div>
              <commentEditAble
                :count="1500"
                :label="$t('workspace.channel.toDo')"
                @addComment="addComment"
              ></commentEditAble>
            </div>
          </div>
        </div>

        <div class="text-h4 q-mb-sm">Comment upfile / emoji</div>
        <div class="row q-mb-md">
          <div class="col">
            <div class="pb-2">
              <div>{{ comment }}</div>
              <commentEditAble
                placeholder="Write your comment...."
                @addComment="addComment"
                :show-action="true"
              ></commentEditAble>
            </div>
          </div>
        </div>

        <div class="text-h4 q-mb-sm">emoji</div>
        <div class="row q-mb-md">
          <div class="col">
            <div class="pb-2">
              <AppPickerComposition></AppPickerComposition>
              <AppPickerOptions></AppPickerOptions>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- list month -->
    <YearCalender v-if="false" />

    <TableStatistic v-if="false" />
    <test-chat v-if="false" />
    <div v-if="action.chat">
      <div
        v-for="item in infoChat"
        :key="item.id"
      >
        <div>{{ item.chat.statusChat }}</div>
        <div>{{ item.chat.typeChat }}</div>
        <card-chat :info-card-chat="item" />
      </div>
      <div class="row">
        <InputChat
          class="col-6 comment-edit-able"
          :key-content="`input-chat`"
          :channel-id="9"
          type="comment"
          placeholder="Type your message here"
          @addComment="addComment"
          show-action
          :type-action="'edit'"
          :bodyReply="bodyEdit"
        ></InputChat>
      </div>
    </div>

    <div v-if="action.scroll">
      <scroll-page></scroll-page>
    </div>

    <div class="box-fixed">
      <div class="box-fixed-scroll">
        <c-btn
          color="primary"
          outline
          size="small"
          class="box-fixed__btn"
          @click="actionScroll"
        >
          <template #default>
            <q-icon
              size="16px"
              :name="IsDown ? 'bi-chevron-double-up' : 'bi-chevron-double-down'"
            />
          </template>
        </c-btn>
      </div>
    </div>
  </div>
  <div id="downId"></div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, reactive } from 'vue';
import CardChannel from 'src/components/common/CardChannel.vue';
import CardStatus from 'src/components/common/CardStatus.vue';
import CardComment from 'src/components/common/CardComment.vue';
import CNotify from 'src/components/common/CNotify.vue';
import CardFileUpload from 'components/upfile/cardFileUpload.vue';
import { formChannel } from 'src/interface/cardChannel';
import { formComment, formStatus } from 'src/interface/comment';
import { formNotify } from 'src/interface/notify';
import commentEditAble from 'components/general/commentEditAble.vue';
import AppPickerComposition from 'components/emoji/AppPickerComposition.vue';
import AppPickerOptions from 'components/emoji/AppPickerOptions.vue';
import YearCalender from 'components/general/YearCalender.vue';
import TableStatistic from 'components/general/TableStatistic.vue';
import TestChat from 'components/chat/testChat.vue';
import CardChat from 'components/chat/CardChat.vue';
import { formChat } from 'src/interface/chat';
import InputChat from 'components/chat/InputChat.vue';
import { scrollToId } from 'src/helper/global';
import ScrollPage from 'components/test/testScrollPage.vue';

export default defineComponent({
  components: {
    ScrollPage,
    CardChat,
    TestChat,
    CardFileUpload,
    CardChannel,
    CardStatus,
    CardComment,
    CNotify,
    commentEditAble,
    AppPickerComposition,
    AppPickerOptions,
    YearCalender,
    TableStatistic,
    InputChat,
  },

  setup() {
    const inputValue = ref<string>('');
    const inputValue2 = ref<string>('');
    const inputValue3 = ref<string>('');
    const inputValue4 = ref<string>('');
    const inputValue5 = ref<string>('');
    const inputValue6 = ref<string>('');
    const isPassword = ref<boolean>(true);
    const changePasswordType = () => {
      isPassword.value = !isPassword.value;
    };
    const iconClick = () => {
      console.log('iconClick() run');
    };
    const state = reactive<{
      files: any;
      comment: string;
      IsDown: boolean;
      action: any;
    }>({
      files: [],
      comment: '',
      IsDown: false,
      action: {
        text: false,
        button: false,
        textField: false,
        form: false,
        notify: false,
        upload: false,
        comment: false,
        chat: false,
        scroll: false,
      },
    });
    const addComment = (comment: string, files?: any, listTag?: any) => {
      console.log('comment', comment);
      console.log('files', files);
      console.log('listTag', listTag);
    };
    const updateListImg = (newItem: any) => {
      state.files = state.files.map((item: any) => {
        if (!item.originalname && item.name === newItem.originalname) {
          return {
            ...newItem,
            name: newItem.originalname,
          };
        }
        return item;
      });
    };
    const getFile = (listFile: any) => {
      if (!listFile) return;
      listFile.map((item: any) => {
        updateListImg(item);
      });
    };
    const getFileBefore = (listFile: any) => {
      if (!listFile) return;
      listFile.map((item: any) => {
        state.files.push({
          ...item,
          name: item.originalname || item.name || '',
        });
      });
    };
    const removeFile = (file: any) => {
      state.files = state.files.filter((item: any) => item.id !== file.id);
    };

    const states = reactive<{
      formChannelInfo: Array<formChannel>;
      formStatus: Array<formStatus>;
      formComment: Array<formComment>;
      formNotify: Array<formNotify>;
      showNotify: boolean;
      infoChat: Array<formChat>;
      bodyEdit: any;
    }>({
      formChannelInfo: [
        {
          id: 1,
          statusBackground: 'success',
          radio: '',
          // status của date sẽ dựa vào dữ liệu trả ra là sent( ngày gửi) || received( ngày nhận )
          date: { status: 'sent', time: 1678180043000 },
          content:
            'Create marketing planner in May and start our projects in August 28th, content is only limit 1 line, if long text we will',
          // dựa vào số ngày quy ước khi trả dữ liệu ra, để hiển thị ra card ra due(thời hạn) || overdue(hết hạn)
          due: { status: 'due', date: 13 },
          priority: 'Medium',
          attachment:
            'Marketing Planner version 2.docx ; Image1234.png ; Image 56892.jpeg, Design App for May.ai; Design App if long text we willl',
          markDone: 12,
          comment: 23,
          creator: {
            avatar: 'https://cdn.quasar.dev/img/avatar.png',
            name: 'Avatar',
          },
          doneTask: true,
        },
        {
          id: 2,
          statusBackground: 'basic',
          radio: '',
          // status của date sẽ dựa vào dữ liệu trả ra là sent( ngày gửi) || received( ngày nhận )
          date: { status: 'received', time: 1678180043000 },
          content:
            'Create marketing planner in May and start our projects in August 28th, content is only limit 1 line, if long text we will',
          // dựa vào số ngày quy ước khi trả dữ liệu ra, để hiển thị ra card ra due(thời hạn) || overdue(hết hạn)
          due: { status: 'overdue', date: 1 },
          priority: 'High',
          attachment:
            'Marketing Planner version 2.docx ; Image1234.png ; Image 56892.jpeg, Design App for May.ai; Design App if long text we willl',
          markDone: 1,
          comment: 13,
          creator: {
            avatar: 'https://cdn.quasar.dev/img/avatar.png',
            name: 'Avatar',
          },
          warning: true,
        },
        {
          id: 3,
          statusBackground: 'basic',
          radio: '',
          // status của date sẽ dựa vào dữ liệu trả ra là sent( ngày gửi) || received( ngày nhận )
          date: { status: 'received', time: 1678180043000 },
          content:
            'Create marketing planner in May and start our projects in August 28th, content is only limit 1 line, if long text we will',
          // dựa vào số ngày quy ước khi trả dữ liệu ra, để hiển thị ra card ra due(thời hạn) || overdue(hết hạn)
          due: { status: 'due', date: 13 },
          priority: 'Low',
          attachment:
            'Marketing Planner version 2.docx ; Image1234.png ; Image 56892.jpeg, Design App for May.ai; Design App if long text we willl',
          markDone: 12,
          comment: 23,
          creator: {
            avatar: '',
            name: 'Avatar',
          },
          flag: true,
          warning: true,
        },
        {
          id: 4,
          statusBackground: 'disable',
          radio: '',
          // status của date sẽ dựa vào dữ liệu trả ra là sent( ngày gửi) || received( ngày nhận )
          date: { status: 'received', time: 1678180043000 },
          content:
            'Create marketing planner in May and start our projects in August 28th, content is only limit 1 line, if long text we will',
          // dựa vào số ngày quy ước khi trả dữ liệu ra, để hiển thị ra card ra due(thời hạn) || overdue(hết hạn)
          due: { status: 'overdue', date: 13 },
          priority: 'Low',
          attachment:
            'Marketing Planner version 2.docx ; Image1234.png ; Image 56892.jpeg, Design App for May.ai; Design App if long text we willl',
          markDone: 12,
          comment: 23,
          creator: {
            avatar: 'https://cdn.quasar.dev/img/avatar.png',
            name: 'Avatar',
          },
          flag: true,
          warning: true,
        },
        {
          id: 5,
          statusBackground: 'success',
          radio: '',
          // status của date sẽ dựa vào dữ liệu trả ra là sent( ngày gửi) || received( ngày nhận ) || draft
          date: { status: 'draft', time: 1678180043000 },
          // dựa vào số ngày quy ước khi trả dữ liệu ra, để hiển thị ra card ra due(thời hạn) || overdue(hết hạn)
          due: { status: 'due', date: 13 },
          priority: 'Low',
        },
        {
          id: 6,
          statusBackground: 'success',
          radio: '',
          content:
            'Create marketing planner in May and start our projects in August 28th, content is only limit 1 line, if long text we will',
          // status của date sẽ dựa vào dữ liệu trả ra là sent( ngày gửi) || received( ngày nhận ) || draft
          date: { status: 'draft', time: 1678180043000 },
          // dựa vào số ngày quy ước khi trả dữ liệu ra, để hiển thị ra card ra due(thời hạn) || overdue(hết hạn)
          due: { status: 'due', date: 13 },
          priority: 'Medium',
        },
        {
          id: 7,
          statusBackground: 'success',
          radio: '',
          // status của date sẽ dựa vào dữ liệu trả ra là sent( ngày gửi) || received( ngày nhận )
          date: { status: 'draft', time: 1678180043000 },
          content:
            'kkkkkkkkkkkkkkkkkk Create marketing planner in May and start our projects in August 28th, content is only limit 1 line, if long text we will',
          // dựa vào số ngày quy ước khi trả dữ liệu ra, để hiển thị ra card ra due(thời hạn) || overdue(hết hạn)
          due: { status: 'overdue', date: 13 },
          priority: 'High',
          attachment:
            'Marketing Planner version 2.docx ; Image1234.png ; Image 56892.jpeg, Design App for May.ai; Design App if long text we willl',
          markDone: 12,
          comment: 23,
        },
        {
          id: 8,
          statusBackground: 'basic',
          radio: '',
          // status của date sẽ dựa vào dữ liệu trả ra là sent( ngày gửi) || received( ngày nhận )
          date: { status: 'draft', time: 1678180043000 },
          content:
            'Create marketing planner in May and start our projects in August 28th, content is only limit 1 line, if long text we will',
          // dựa vào số ngày quy ước khi trả dữ liệu ra, để hiển thị ra card ra due(thời hạn) || overdue(hết hạn)
          due: { status: 'overdue', date: 13 },
          priority: 'High',
          attachment:
            'Marketing Planner version 2.docx ; Image1234.png ; Image 56892.jpeg, Design App for May.ai; Design App if long text we willl',
          markDone: 12,
          comment: 23,
        },
      ],

      formStatus: [],
      formNotify: [],
      formComment: [
        {
          id: 1,
          avatar: '',
          name: 'Nguyen Thi Hue',
          content:
            'I would like to have an offline meeting this Friday. I have pretty awesome idea to present. 882 inspirational designs, illustrations, and graphic elements from the world’s best designers.',
          time: '2023-03-17T09:40:15.798Z',
          like: { number: 0, status: 'action' },
          showComment: false,
          children: [
            {
              id: 2,
              avatar: '',
              name: 'Nguyen Thi Hue',
              content:
                'I would like to have an offline meeting this Friday. I have pretty awesome idea to present. 882 inspirational designs, illustrations, and graphic elements from the world’s best designers.',
              time: '2023-03-17T09:40:15.798Z',
              like: { number: 12, status: 'action' },
              showComment: false,
            },
          ],
        },
      ],
      showNotify: false,
      infoChat: [
        {
          id: 1,
          user: {
            name: 'khanh',
            avatar:
              'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
          },
          chat: {
            typeChat: 'sent',
            statusChat: 'normal',
            time: '2023-03-13T08:10:00.840Z',
            text: '<a href="javascript:void(0);" class="mention-item-click" user-id="15" user-label="yesopev767@asoflex.com">@yesopev767@asoflex.com</a> asdsad',
            readAll: true,
          },
          files: [
            {
              id: 1,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
              mimetype: 'image/jpeg',
              name: '1_wire_18_10_2021_04.jpg',
              originalname: '1_wire_18_10_2021_04.jpg',
            },
            // {
            //   id: 2,
            //   url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/123fa1dc-71e0-4c04-835f-6f13670bdc00-backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
            //   mimetype: 'application/json',
            //   name: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
            //   originalname: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json'
            // },
            {
              id: 3,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
              mimetype: 'image/jpeg',
              name: '1_wire_18_10_2021_04.jpg',
              originalname: '1_wire_18_10_2021_04.jpg',
            },
          ],
          pinChat: false,
          reactions: [
            {
              id: 263,
              emoji: ':sob:',
              created_at: '2023-05-30T10:55:24.643Z',
              user: {
                id: 5,
                email: 'khanh.dn@agiletechsoftware.com',
                full_name: 'Đỗ Ngọc Khánh',
                avatar: {
                  url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/d55141b8-0f57-4d6e-b4bd-7557552b58dc-1_wire_18_10_2021_04.jpg',
                },
              },
            },
          ],
        },
        {
          id: 2,
          user: {
            name: 'khanh 2',
            avatar:
              'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
          },
          chat: {
            typeChat: 'sent',
            statusChat: 'normal',
            time: '2023-03-13T08:10:00.840Z',
            text: '<a href="javascript:void(0);" class="mention-item-click" user-id="15" user-label="yesopev767@asoflex.com">@yesopev767@asoflex.com</a> asdsad',
          },
          files: [
            {
              id: 1,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
              mimetype: 'image/jpeg',
              name: '1_wire_18_10_2021_04.jpg',
              originalname: '1_wire_18_10_2021_04.jpg',
            },
            {
              id: 2,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/123fa1dc-71e0-4c04-835f-6f13670bdc00-backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              mimetype: 'application/json',
              name: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              originalname: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
            },
            {
              id: 3,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
              mimetype: 'image/jpeg',
              name: '1_wire_18_10_2021_04.jpg',
              originalname: '1_wire_18_10_2021_04.jpg',
            },
          ],
          pinChat: false,
        },
        {
          id: 3,
          user: {
            name: 'khanh 3',
            avatar:
              'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
          },
          chat: {
            typeChat: 'received',
            statusChat: 'normal',
            time: '2023-03-13T08:10:00.840Z',
            text: '<a href="javascript:void(0);" class="mention-item-click" user-id="15" user-label="yesopev767@asoflex.com">@yesopev767@asoflex.com</a> asdsad',
          },
          files: [
            {
              id: 1,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
              mimetype: 'image/jpeg',
              name: '1_wire_18_10_2021_04.jpg',
              originalname: '1_wire_18_10_2021_04.jpg',
            },
            {
              id: 2,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/123fa1dc-71e0-4c04-835f-6f13670bdc00-backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              mimetype: 'application/json',
              name: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              originalname: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
            },
            {
              id: 3,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
              mimetype: 'image/jpeg',
              name: '1_wire_18_10_2021_04.jpg',
              originalname: '1_wire_18_10_2021_04.jpg',
            },
          ],
          pinChat: false,
        },
        {
          id: 3,
          user: {
            name: 'khanh 3',
            avatar:
              'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
          },
          chat: {
            typeChat: 'received',
            statusChat: 'normal',
            time: '2023-03-13T08:10:00.840Z',
            text: '<a href="javascript:void(0);" class="mention-item-click" user-id="15" user-label="yesopev767@asoflex.com">@yesopev767@asoflex.com</a> asdsad',
          },
          files: [
            {
              id: 1,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
              mimetype: 'image/jpeg',
              name: '1_wire_18_10_2021_04.jpg',
              originalname: '1_wire_18_10_2021_04.jpg',
            },
            {
              id: 2,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/123fa1dc-71e0-4c04-835f-6f13670bdc00-backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              mimetype: 'application/json',
              name: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              originalname: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
            },
            {
              id: 3,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
              mimetype: 'image/jpeg',
              name: '1_wire_18_10_2021_04.jpg',
              originalname: '1_wire_18_10_2021_04.jpg',
            },
          ],
          pinChat: true,
        },
        {
          id: 4,
          user: {
            id: 2,
            name: 'khanh 3',
            avatar:
              'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
          },
          reply: {
            id: 1,
            text: 'asdasdasdsd',
            user: {
              id: 3,
              name: 'khanh 6',
              avatar:
                'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
            },
            files: [
              {
                id: 1,
                url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
                mimetype: 'image/jpeg',
                name: '1_wire_18_10_2021_04.jpg',
                originalname: '1_wire_18_10_2021_04.jpg',
              },
              {
                id: 2,
                url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/123fa1dc-71e0-4c04-835f-6f13670bdc00-backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
                mimetype: 'application/json',
                name: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
                originalname: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              },
            ],
          },
          chat: {
            typeChat: 'received',
            statusChat: 'reply',
            time: '2023-03-13T08:10:00.840Z',
            text: '<a href="javascript:void(0);" class="mention-item-click" user-id="15" user-label="yesopev767@asoflex.com">@yesopev767@asoflex.com</a> asdsad',
          },
          files: [
            {
              id: 1,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
              mimetype: 'image/jpeg',
              name: '1_wire_18_10_2021_04.jpg',
              originalname: '1_wire_18_10_2021_04.jpg',
            },
            {
              id: 2,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/123fa1dc-71e0-4c04-835f-6f13670bdc00-backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              mimetype: 'application/json',
              name: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              originalname: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
            },
            {
              id: 3,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
              mimetype: 'image/jpeg',
              name: '1_wire_18_10_2021_04.jpg',
              originalname: '1_wire_18_10_2021_04.jpg',
            },
          ],
          pinChat: false,
        },
        {
          id: 5,
          user: {
            id: 3,
            name: 'khanh 3',
            avatar:
              'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
          },
          reply: {
            id: 1,
            text: 'asdasdasdsd',
            user: {
              id: 3,
              name: 'khanh 3',
              avatar:
                'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
            },
            files: [
              {
                id: 1,
                url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
                mimetype: 'image/jpeg',
                name: '1_wire_18_10_2021_04.jpg',
                originalname: '1_wire_18_10_2021_04.jpg',
              },
              {
                id: 2,
                url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/123fa1dc-71e0-4c04-835f-6f13670bdc00-backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
                mimetype: 'application/json',
                name: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
                originalname: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              },
            ],
          },
          chat: {
            typeChat: 'sent',
            statusChat: 'reply',
            time: '2023-03-13T08:10:00.840Z',
            text: '<a href="javascript:void(0);" class="mention-item-click" user-id="15" user-label="yesopev767@asoflex.com">@yesopev767@asoflex.com</a> asdsad',
          },
          files: [
            {
              id: 1,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
              mimetype: 'image/jpeg',
              name: '1_wire_18_10_2021_04.jpg',
              originalname: '1_wire_18_10_2021_04.jpg',
            },
            {
              id: 2,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/123fa1dc-71e0-4c04-835f-6f13670bdc00-backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              mimetype: 'application/json',
              name: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              originalname: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
            },
            {
              id: 3,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
              mimetype: 'image/jpeg',
              name: '1_wire_18_10_2021_04.jpg',
              originalname: '1_wire_18_10_2021_04.jpg',
            },
          ],
          pinChat: false,
        },
        {
          id: 6,
          user: {
            id: 3,
            name: 'khanh 3',
            avatar:
              'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
          },
          reply: {
            id: 1,
            text: 'asdasdasdsd',
            user: {
              id: 3,
              name: 'khanh 3',
              avatar:
                'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
            },
            files: [
              {
                id: 1,
                url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
                mimetype: 'image/jpeg',
                name: '1_wire_18_10_2021_04.jpg',
                originalname: '1_wire_18_10_2021_04.jpg',
              },
              {
                id: 2,
                url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/123fa1dc-71e0-4c04-835f-6f13670bdc00-backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
                mimetype: 'application/json',
                name: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
                originalname: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              },
            ],
          },
          chat: {
            typeChat: 'sent',
            statusChat: 'forward',
            time: '2023-03-13T08:10:00.840Z',
            text: '',
          },
          files: [
            {
              id: 1,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
              mimetype: 'image/jpeg',
              name: '1_wire_18_10_2021_04.jpg',
              originalname: '1_wire_18_10_2021_04.jpg',
            },
            {
              id: 2,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/123fa1dc-71e0-4c04-835f-6f13670bdc00-backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              mimetype: 'application/json',
              name: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              originalname: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
            },
            {
              id: 3,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
              mimetype: 'image/jpeg',
              name: '1_wire_18_10_2021_04.jpg',
              originalname: '1_wire_18_10_2021_04.jpg',
            },
          ],
          pinChat: false,
        },
        {
          id: 7,
          user: {
            id: 3,
            name: 'khanh 3',
            avatar:
              'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
          },
          reply: {
            id: 1,
            text: 'asdasdasdsd',
            user: {
              id: 3,
              name: 'khanh 3',
              avatar:
                'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
            },
            files: [
              {
                id: 1,
                url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
                mimetype: 'image/jpeg',
                name: '1_wire_18_10_2021_04.jpg',
                originalname: '1_wire_18_10_2021_04.jpg',
              },
              {
                id: 2,
                url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/123fa1dc-71e0-4c04-835f-6f13670bdc00-backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
                mimetype: 'application/json',
                name: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
                originalname: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              },
            ],
          },
          chat: {
            typeChat: 'sent',
            statusChat: 'normal',
            time: '2023-03-13T08:10:00.840Z',
            text: '<a href="javascript:void(0);" class="mention-item-click" user-id="15" user-label="yesopev767@asoflex.com">@yesopev767@asoflex.com</a> asdsad',
          },
          files: [
            {
              id: 1,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
              mimetype: 'image/jpeg',
              name: '1_wire_18_10_2021_04.jpg',
              originalname: '1_wire_18_10_2021_04.jpg',
            },
            {
              id: 2,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/123fa1dc-71e0-4c04-835f-6f13670bdc00-backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              mimetype: 'application/json',
              name: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              originalname: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
            },
            {
              id: 3,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
              mimetype: 'image/jpeg',
              name: '1_wire_18_10_2021_04.jpg',
              originalname: '1_wire_18_10_2021_04.jpg',
            },
          ],
          pinChat: false,
          editChat: true,
        },
        {
          id: 8,
          user: {
            id: 3,
            name: 'khanh 3',
            avatar:
              'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
          },
          reply: {
            id: 1,
            text: 'asdasdasdsd',
            user: {
              id: 3,
              name: 'khanh 3',
              avatar:
                'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
            },
            files: [
              {
                id: 1,
                url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
                mimetype: 'image/jpeg',
                name: '1_wire_18_10_2021_04.jpg',
                originalname: '1_wire_18_10_2021_04.jpg',
              },
              {
                id: 2,
                url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/123fa1dc-71e0-4c04-835f-6f13670bdc00-backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
                mimetype: 'application/json',
                name: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
                originalname: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              },
            ],
          },
          chat: {
            typeChat: 'sent',
            statusChat: 'normal',
            time: '2023-03-13T08:10:00.840Z',
            text: '<a href="javascript:void(0);" class="mention-item-click" user-id="15" user-label="yesopev767@asoflex.com">@yesopev767@asoflex.com</a> asdsad',
          },
          files: [
            {
              id: 1,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
              mimetype: 'image/jpeg',
              name: '1_wire_18_10_2021_04.jpg',
              originalname: '1_wire_18_10_2021_04.jpg',
            },
            {
              id: 2,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/123fa1dc-71e0-4c04-835f-6f13670bdc00-backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              mimetype: 'application/json',
              name: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
              originalname: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
            },
            {
              id: 3,
              url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
              mimetype: 'image/jpeg',
              name: '1_wire_18_10_2021_04.jpg',
              originalname: '1_wire_18_10_2021_04.jpg',
            },
          ],
          pinChat: false,
          editChat: true,
          deleteChat: {
            isDeleted: true,
            user: {
              id: 3,
              name: 'khanh 3',
              avatar:
                'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
            },
            time: '2023-03-13T08:10:00.840Z',
          },
        },
      ],
      bodyEdit: {
        user: {
          name: 'khanh',
        },
        text: 'asssssssssssssssssssssssssssssssasssssssssssssssssssssssssssssssasssssssssssssssssssssssssssssssasssssssssssssssssssssssssssssssasssssssssssssssssssssssssssssss',
        files: [
          {
            id: 1,
            url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
            mimetype: 'image/jpeg',
            name: '1_wire_18_10_2021_04.jpg',
            originalname: '1_wire_18_10_2021_04.jpg',
          },
          {
            id: 2,
            url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/123fa1dc-71e0-4c04-835f-6f13670bdc00-backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
            mimetype: 'application/json',
            name: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
            originalname: 'backup_versions_631ee0472d2f7f9ecf6d1e7b.json',
          },
          {
            id: 3,
            url: 'https://tmessage.s3.ap-southeast-1.amazonaws.com/development/974ebe3d-2f16-4596-bc9f-82079b96019c-1_wire_18_10_2021_04.jpg',
            mimetype: 'image/jpeg',
            name: '1_wire_18_10_2021_04.jpg',
            originalname: '1_wire_18_10_2021_04.jpg',
          },
        ],
      },
    });

    const handleShowNotify = () => {
      states.showNotify = true;
      states.formNotify.forEach((item: formNotify) => (item.show = true));
    };
    const actionScroll = () => {
      state.IsDown = !state.IsDown;
      if (state.IsDown) {
        scrollToId('downId');
      } else {
        scrollToId('upId');
      }
    };
    return {
      ...toRefs(state),
      ...toRefs(states),
      inputValue,
      inputValue2,
      inputValue3,
      inputValue4,
      inputValue5,
      inputValue6,
      isPassword,
      changePasswordType,
      iconClick,
      getFileBefore,
      removeFile,
      getFile,
      handleShowNotify,
      addComment,
      actionScroll,
    };
  },
});
</script>

<style lang="scss" scoped>
.my-card {
  margin-bottom: 100px;
}

.uploads {
  margin-bottom: 8px;
}

.card-people {
  width: 592px;
  padding: 8px 0;
}
.box-fixed-top {
  position: fixed;
  top: 0;
  z-index: 99;
  background: white;
  width: 100%;
}
.box-fixed {
  position: fixed;
  right: 32px;
  bottom: 40px;
  z-index: 10;

  &-button {
    margin-bottom: 24px;
  }

  &-scroll {
    display: flex;
    justify-content: flex-end;
  }

  .box-fixed__btn {
    width: 32px;
    border-radius: 50%;
    background: #e7f6e9 !important;

    .q-icon {
      color: #1c8c44;
    }
  }
}
#upId {
  padding-top: 100px;
}
#downId {
  width: 100%;
  height: 50px;
}
</style>
