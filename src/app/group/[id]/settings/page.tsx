'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Crown, Trash2, UserMinus } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import ConfirmDialog from '@/components/common/ConfirmDialog';
import PageLoader from '@/components/common/PageLoader';
import StateDisplay from '@/components/common/StateDisplay';
import GroupActions from '@/components/group/setting/GroupActions';
import GroupBasicSettings from '@/components/group/setting/GroupBasicSettings';
import GroupHeader from '@/components/group/setting/GroupHeader';
import GroupInfo from '@/components/group/setting/GroupInfo';
import GroupMemberList from '@/components/group/setting/GroupMemberList';
import GroupMemberManagement from '@/components/group/setting/GroupMemberManagement';
import { useBanMember, useDeleteGroup, useLeaveGroup, useTransferOwnership, useUpdateGroup } from '@/hooks/group/useGroupSettings';
import { useLastGroupTab } from '@/hooks/group/useLastGroupTab';
import { useGroupDetail } from '@/hooks/queries/useGroupDetail';
import { useCurrentUserData } from '@/hooks/user/useCurrentUser';
import { useTranslation } from '@/providers/LanguageProvider';
import { UpdateGroupFormData, createValidationSchema } from '@/utils/validation';


export default function GroupSettingsPage() {
  const { t } = useTranslation();
  const params = useParams();
  const currentUser = useCurrentUserData();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showBanDialog, setShowBanDialog] = React.useState(false);
  const [showTransferDialog, setShowTransferDialog] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState<Group.GroupUserInfo | null>(null);
  const [banReason, setBanReason] = React.useState('');
  
  // Save current tab as last visited
  useLastGroupTab();
  
  const groupId = Array.isArray(params.id) ? parseInt(params.id[0], 10) : parseInt(params.id as string, 10);

  // 그룹 상세 정보 조회
  const { data: groupDetail, isLoading, error, refetch } = useGroupDetail({
    groupId,
    enabled: !!groupId,
  });

  // 권한 확인 - 그룹장만 접근 가능
  const isGroupOwner = groupDetail && currentUser && groupDetail.owner.userId === currentUser.id;

  // Group mutations
  const updateGroupMutation = useUpdateGroup(groupId);
  const deleteGroupMutation = useDeleteGroup(groupId);
  const banMemberMutation = useBanMember(groupId);
  const leaveGroupMutation = useLeaveGroup(groupId);
  const transferOwnershipMutation = useTransferOwnership(groupId);

  // 번역된 validation 스키마 생성
  const validationSchema = createValidationSchema(t);

  const form = useForm<UpdateGroupFormData>({
    resolver: zodResolver(validationSchema.updateGroupSchema),
    mode: 'onChange', // 실시간 유효성 검사 활성화
    reValidateMode: 'onChange', // 재검증 모드 추가
    defaultValues: {
      name: '',
      description: '',
      isPublic: true,
      tags: [],
    },
  });

  const { reset } = form;

  // 그룹 데이터로 폼 초기화
  React.useEffect(() => {
    if (groupDetail) {
      reset({
        name: groupDetail.name,
        description: groupDetail.description,
        isPublic: groupDetail.isPublic,
        tags: groupDetail.tags,
      });
      
      // 폼 리셋 후 validation 트리거
      setTimeout(() => {
        form.trigger();
      }, 0);
    }
  }, [groupDetail, reset, form]);

  // Validation error handler
  const onError = (errors: any) => {
    // Show validation error toast with specific messages
    if (errors.name) {
      toast.error(`${t('group.validation.groupName')}: ${errors.name.message}`);
      return;
    }
    if (errors.description) {
      toast.error(`${t('group.validation.description')}: ${errors.description.message}`);
      return;
    }
    if (errors.groundRules) {
      toast.error(`${t('group.validation.groundRules')}: ${errors.groundRules.message || t('group.validation.groundRulesEmpty')}`);
      return;
    }
    if (errors.tags) {
      toast.error(`${t('group.validation.tags')}: ${errors.tags.message}`);
      return;
    }
  };

  // Form submit handler for valid data
  const onValidSubmit = async (values: UpdateGroupFormData) => {
    await onSubmit(values);
  };

  // Form submit handler
  const onSubmit = async (values: UpdateGroupFormData) => {
    if (!groupDetail) return;

    const request: Group.UpdateGroupApiRequest = {
      name: values.name,
      description: values.description || groupDetail.description,
      groundRule: values.groundRules 
        ? values.groundRules.filter(rule => rule.trim().length > 0).join('\n')
        : groupDetail.groundRule,
      tags: values.tags,
      isPublic: values.isPublic,
    };

    try {
      await updateGroupMutation.mutateAsync(request);
      // 성공 시 토스트는 mutation의 onSuccess에서 처리됨
    } catch {
      // 에러는 mutation에서 이미 toast로 표시됨
    }
  };

  // 그룹 삭제 핸들러
  const handleDeleteGroup = async () => {
    try {
      await deleteGroupMutation.mutateAsync();
      setShowDeleteDialog(false);
    } catch {
      // 에러는 mutation에서 이미 toast로 표시됨
    }
  };

  // 멤버 추방 핸들러
  const handleBanMember = async (reason?: string) => {
    if (!selectedMember || !reason?.trim()) return;
    
    try {
      await banMemberMutation.mutateAsync({
        userId: selectedMember.userId,
        reason: reason.trim(),
      });
      setShowBanDialog(false);
      setSelectedMember(null);
      setBanReason('');
    } catch {
      // 에러는 mutation에서 이미 toast로 표시됨
    }
  };

  // 그룹 탈퇴 핸들러 (멤버용)
  const handleLeaveGroup = async () => {
    try {
      await leaveGroupMutation.mutateAsync();
      setShowDeleteDialog(false);
    } catch {
      // 에러는 mutation에서 이미 toast로 표시됨
    }
  };

  // 소유권 이전 핸들러
  const handleTransferOwnership = async () => {
    if (!selectedMember) return;

    try {
      await transferOwnershipMutation.mutateAsync(selectedMember.userId);
      setShowTransferDialog(false);
      setSelectedMember(null);
    } catch {
      // 에러는 mutation에서 이미 toast로 표시됨
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <PageLoader message={t('group.groupDetails')} />
    );
  }

  // Error state
  if (error || !groupDetail) {
    return (
      <div className="h-full flex items-center justify-center">
        <StateDisplay
          type="error"
          title={t('common.failedToLoad')}
          message={t('common.serverError')}
          onRetry={() => refetch()}
          retryText={t('common.retry')}
        />
      </div>
    );
  }


  // 그룹장이 아닌 경우 멤버 전용 페이지 표시
  if (!isGroupOwner) {
    return (
      <div className="space-y-6 px-6 py-6 max-w-4xl mx-auto">
        {/* 헤더 */}
        <GroupHeader 
          groupName={groupDetail.name}
          isPublic={groupDetail.isPublic}
          password={groupDetail.password}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 그룹 정보 및 멤버 목록 */}
          <GroupMemberList 
            owner={groupDetail.owner}
            members={groupDetail.members}
            currentUserId={currentUser?.id}
            description={groupDetail.description}
            groundRule={groupDetail.groundRule}
            tags={groupDetail.tags}
          />

          {/* 사이드바 */}
          <div className="lg:col-span-1 space-y-6">
            <GroupInfo 
              totalMembers={groupDetail.members.length}
              createdAt={groupDetail.createdAt}
            />

            <GroupActions
              isOwner={false}
              onLeaveGroup={() => setShowDeleteDialog(true)}
            />
          </div>
        </div>

        {/* 탈퇴 확인 다이얼로그 */}
        <ConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          title={t('group.leaveGroup')}
          description={
            <>
              <span className="font-semibold">"{groupDetail?.name}"</span>{t('group.leaveGroupConfirmWithName')}
              <br className="mt-2" />
              {t('group.leaveGroupConfirmText')}
            </>
          }
          confirmText={t('group.leaveGroup')}
          cancelText={t('common.cancel')}
          onConfirm={handleLeaveGroup}
          variant="destructive"
          isLoading={leaveGroupMutation.isPending}
          loadingText={`${t('group.leaveGroup')}...`}
          icon={UserMinus}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 py-6 max-w-6xl mx-auto">
      {/* 헤더 */}
      <GroupHeader 
        groupName={groupDetail.name}
        isPublic={groupDetail.isPublic}
        password={groupDetail.password}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <GroupBasicSettings 
            form={form}
            onSubmit={onValidSubmit}
            onError={onError}
            isSubmitting={form.formState.isSubmitting || updateGroupMutation.isPending}
            excludeFromValidation={groupDetail?.name}
            initialValues={groupDetail ? {
              name: groupDetail.name,
              description: groupDetail.description,
              isPublic: groupDetail.isPublic,
              tags: groupDetail.tags,
            } : undefined}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <GroupMemberManagement 
            owner={groupDetail.owner}
            members={groupDetail.members}
            currentUserId={currentUser?.id}
            isGroupOwner={groupDetail.owner.userId === currentUser?.id}
            onTransferOwnership={(member) => {
              setSelectedMember(member);
              setShowTransferDialog(true);
            }}
            onBanMember={(member) => {
              setSelectedMember(member);
              setShowBanDialog(true);
            }}
          />

          <GroupInfo 
            totalMembers={groupDetail.members.length}
            createdAt={groupDetail.createdAt}
          />

          <GroupActions
            isOwner={true}
            onDeleteGroup={() => setShowDeleteDialog(true)}
          />
        </div>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title={t('group.deleteGroup')}
        description={
          <>
            <span className="font-semibold">"{groupDetail?.name}"</span>{t('group.deleteGroupConfirmWithName')}
            <br className="mt-2" />
            {t('group.deleteGroupWarningText')}
          </>
        }
        confirmText={t('group.deleteGroup')}
        cancelText={t('common.cancel')}
        onConfirm={handleDeleteGroup}
        variant="destructive"
        isLoading={deleteGroupMutation.isPending}
        loadingText={`${t('common.delete')}...`}
        icon={Trash2}
      />

      {/* 멤버 추방 다이얼로그 */}
      <ConfirmDialog
        open={showBanDialog}
        onOpenChange={(open) => {
          setShowBanDialog(open);
          if (!open) {
            setSelectedMember(null);
            setBanReason('');
          }
        }}
        title={t('group.kickMember')}
        description={
          <>
            <span className="font-semibold">{selectedMember?.nickname}</span>{t('group.kickMemberConfirmWithName')}
          </>
        }
        confirmText={t('group.kickMember')}
        cancelText={t('common.cancel')}
        onConfirm={handleBanMember}
        onCancel={() => {
          setSelectedMember(null);
          setBanReason('');
        }}
        variant="destructive"
        isLoading={banMemberMutation.isPending}
        loadingText={`${t('group.kickMember')}...`}
        icon={UserMinus}
        showTextarea={true}
        textareaLabel={t('group.kickMemberReason')}
        textareaPlaceholder={t('group.kickMemberReasonPlaceholder')}
        textareaRequired={true}
        textareaValue={banReason}
        onTextareaChange={setBanReason}
      />

      {/* 소유권 이전 다이얼로그 */}
      <ConfirmDialog
        open={showTransferDialog}
        onOpenChange={(open) => {
          setShowTransferDialog(open);
          if (!open) {
            setSelectedMember(null);
          }
        }}
        title={t('group.transferOwnership')}
        description={
          <>
            <span className="font-semibold">{selectedMember?.nickname}</span> {t('group.transferOwnershipToMember')}
            <br className="mt-2" />
            <span className="text-amber-600 font-medium">{t('group.deleteGroupWarning')}</span>
          </>
        }
        confirmText={t('group.transferOwnership')}
        cancelText={t('common.cancel')}
        onConfirm={handleTransferOwnership}
        onCancel={() => {
          setSelectedMember(null);
        }}
        variant="default"
        isLoading={transferOwnershipMutation.isPending}
        loadingText={`${t('group.transferOwnership')}...`}
        icon={Crown}
      />
    </div>
  );
}

