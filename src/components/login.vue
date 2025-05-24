<template>
  <div class="box">
    <!-- 登录后 -->
    <Dropdown v-if="userName" @on-click="logoutHandle">
      <a href="javascript:void(0)">
        <Icon type="ios-person" size="20" />
        {{ userName }}
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <template #list>
        <DropdownMenu>
          <DropdownItem>{{ $t('logout') }}</DropdownItem>
        </DropdownMenu>
      </template>
    </Dropdown>
    <!-- 登录前 -->
    <Button v-else shape="circle" icon="ios-person" @click="modal = true"></Button>

    <!-- 登录注册弹框 -->
    <Modal v-model="modal" footer-hide>
      <h3>{{ $t('loginTitle') }}</h3>
      <Tabs :animated="false" @on-click="switchTab">
        <!-- 登录 -->
        <TabPane :label="$t('login')">
          <Form ref="loginForm" :model="formInline" :rules="ruleInline" class="form-box">
            <FormItem prop="username">
              <Input type="text" v-model="formInline.username" :placeholder="$t('identifier')">
                <template #prepend>
                  <Icon type="ios-person-outline"></Icon>
                </template>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="formInline.password" :placeholder="$t('password')">
                <template #prepend>
                  <Icon type="ios-lock-outline"></Icon>
                </template>
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary" long @click="loginHandle">
                {{ $t('login') }}
              </Button>
            </FormItem>
          </Form>
        </TabPane>

        <!-- 注册 -->
        <TabPane :label="$t('register')">
          <Form
            ref="registerForm"
            :model="registerFormInline"
            :rules="registerRuleInline"
            class="form-box"
          >
            <FormItem prop="username">
              <Input
                type="text"
                v-model="registerFormInline.username"
                :placeholder="$t('username')"
              >
                <template #prepend>
                  <Icon type="ios-person-outline"></Icon>
                </template>
              </Input>
            </FormItem>
            <FormItem prop="email">
              <Input type="text" v-model="registerFormInline.email" :placeholder="$t('email')">
                <template #prepend>
                  <Icon type="ios-mail-outline" />
                </template>
              </Input>
            </FormItem>

            <FormItem prop="password">
              <Input
                type="password"
                v-model="registerFormInline.password"
                :placeholder="$t('password')"
              >
                <template #prepend>
                  <Icon type="ios-lock-outline"></Icon>
                </template>
              </Input>
            </FormItem>
            <FormItem>
              <Button type="primary" long @click="registerHandle">
                {{ $t('register') }}
              </Button>
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
    </Modal>
  </div>
</template>

<script setup name="Login">
import { useI18n } from 'vue-i18n';
import { getUserInfo, setToken, getToken, login, register, logout } from '@/api/user';
import { Message, Modal } from 'view-ui-plus';
const modal = ref(false);
const { t } = useI18n();
const userName = ref('');
// 获取用户详情
getUserInfo()
  .then((res) => {
    userName.value = res.data.username;
  })
  .catch(() => {
    logout();
  });

const reloadPage = () => {
  setTimeout(() => {
    window.location.reload();
  }, 1000);
};
// 退出
const logoutHandle = () => {
  Modal.confirm({
    title: t('logoutTip'),
    onOk: () => {
      logout();
      Message.success(t('logoutSuccessTip'));
      reloadPage();
    },
  });
};
// 登录逻辑 ------------------
const formInline = reactive({
  username: '',
  password: '',
});
const ruleInline = reactive({
  username: [{ required: true, message: t('identifierValidate'), trigger: 'blur' }],
  password: [
    { required: true, message: t('passwordValidate'), trigger: 'blur' },
    {
      type: 'string',
      min: 6,
      message: t('passwordValidate'),
      trigger: 'blur',
    },
  ],
});
const loginForm = ref(null);

const loginHandle = () => {
  loginForm.value.validate((valid) => {
    if (valid) {
      login(formInline)
        .then((res) => {
          const { code, data, message } = res.data;
          if (code == 200) {
            setToken(data);
            // console.log('get1:', getToken());
            Message.success(t('welcome'));
            reloadPage();
          } else {
            Message.error(message);
          }
        })
        .catch((res) => {
          Message.error(res.response.data.error.message);
        });
    }
  });
};

// 注册逻辑 分割线--------------------
const registerFormInline = reactive({
  username: '',
  password: '',
  email: '',
});
const registerRuleInline = reactive({
  username: [{ required: true, message: t('identifierValidate'), trigger: 'blur' }],
  password: [
    { required: true, message: t('passwordValidate'), trigger: 'blur' },
    {
      type: 'string',
      min: 6,
      message: t('passwordValidate'),
      trigger: 'blur',
    },
  ],
  email: [
    { required: true, message: t('emailValidate'), trigger: 'blur' },
    {
      type: 'email',
      message: t('emailValidate'),
      trigger: 'blur',
    },
  ],
});
const registerForm = ref(null);

const registerHandle = () => {
  registerForm.value.validate((valid) => {
    if (valid) {
      register(registerFormInline)
        .then((res) => {
          setToken(res.data.data);
          Message.success(t('welcome'));
          reloadPage();
        })
        .catch((res) => {
          Message.error(res.response.data.error.message);
        });
    }
  });
};

const switchTab = () => {
  registerForm.value && registerForm.value.resetFields();
  loginForm.value && loginForm.value.resetFields();
};
</script>
<style scoped lang="less">
.box {
  display: inline-block;
}
.form-box {
  padding-top: 10px;
}
h3 {
  padding-bottom: 10px;
}
</style>
