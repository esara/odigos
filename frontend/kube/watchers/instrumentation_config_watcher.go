package watchers

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/odigos-io/odigos/api/odigos/v1alpha1"
	"github.com/odigos-io/odigos/common/consts"
	"github.com/odigos-io/odigos/frontend/kube"
	"github.com/odigos-io/odigos/frontend/services/sse"
	commonutils "github.com/odigos-io/odigos/k8sutils/pkg/workload"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"
	"k8s.io/client-go/tools/cache"
	toolsWatch "k8s.io/client-go/tools/watch"
)

var instrumentationConfigAddedEventBatcher *EventBatcher
var instrumentationConfigModifiedEventBatcher *EventBatcher
var instrumentationConfigDeletedEventBatcher *EventBatcher

func StartInstrumentationConfigWatcher(ctx context.Context, namespace string) error {
	instrumentationConfigAddedEventBatcher = NewEventBatcher(
		EventBatcherConfig{
			MinBatchSize: 1,
			Duration:     5 * time.Second,
			Event:        sse.MessageEventAdded,
			CRDType:      consts.InstrumentationConfig,
			SuccessBatchMessageFunc: func(count int, crdType string) string {
				return fmt.Sprintf("Successfully created %d sources", count)
			},
			FailureBatchMessageFunc: func(count int, crdType string) string {
				return fmt.Sprintf("Failed to create %d sources", count)
			},
		},
	)

	instrumentationConfigModifiedEventBatcher = NewEventBatcher(
		EventBatcherConfig{
			MinBatchSize: 1,
			Duration:     5 * time.Second,
			Event:        sse.MessageEventModified,
			CRDType:      consts.InstrumentationConfig,
			SuccessBatchMessageFunc: func(count int, crdType string) string {
				return fmt.Sprintf("Successfully updated %d sources", count)
			},
			FailureBatchMessageFunc: func(count int, crdType string) string {
				return fmt.Sprintf("Failed to update %d sources", count)
			},
		},
	)

	instrumentationConfigDeletedEventBatcher = NewEventBatcher(
		EventBatcherConfig{
			MinBatchSize: 1,
			Duration:     5 * time.Second,
			Event:        sse.MessageEventDeleted,
			CRDType:      consts.InstrumentationConfig,
			SuccessBatchMessageFunc: func(count int, crdType string) string {
				return fmt.Sprintf("Successfully deleted %d sources", count)
			},
			FailureBatchMessageFunc: func(count int, crdType string) string {
				return fmt.Sprintf("Failed to delete %d sources", count)
			},
		},
	)

	watcher, err := toolsWatch.NewRetryWatcher("1", &cache.ListWatch{WatchFunc: func(_ metav1.ListOptions) (watch.Interface, error) {
		return kube.DefaultClient.OdigosClient.InstrumentationConfigs(namespace).Watch(ctx, metav1.ListOptions{})
	}})
	if err != nil {
		return fmt.Errorf("failed to create instrumentation config watcher: %w", err)
	}

	go handleInstrumentationConfigWatchEvents(ctx, watcher)
	return nil
}

func handleInstrumentationConfigWatchEvents(ctx context.Context, watcher watch.Interface) {
	ch := watcher.ResultChan()
	defer instrumentationConfigAddedEventBatcher.Cancel()
	defer instrumentationConfigModifiedEventBatcher.Cancel()
	defer instrumentationConfigDeletedEventBatcher.Cancel()
	for {
		select {
		case <-ctx.Done():
			watcher.Stop()
			return
		case event, ok := <-ch:
			if !ok {
				log.Println("InstrumentationConfig watcher closed")
				return
			}
			switch event.Type {
			case watch.Added:
				handleAddedInstrumentationConfig(event.Object.(*v1alpha1.InstrumentationConfig))
			case watch.Modified:
				handleModifiedInstrumentationConfig(event.Object.(*v1alpha1.InstrumentationConfig))
			case watch.Deleted:
				handleDeletedInstrumentationConfig(event.Object.(*v1alpha1.InstrumentationConfig))
			}
		}
	}
}

func handleAddedInstrumentationConfig(instruConfig *v1alpha1.InstrumentationConfig) {
	namespace := instruConfig.Namespace
	name, kind, err := commonutils.ExtractWorkloadInfoFromRuntimeObjectName(instruConfig.Name)
	if err != nil {
		genericErrorMessage(sse.MessageEventAdded, consts.InstrumentationConfig, err.Error())
		return
	}

	target := fmt.Sprintf("namespace=%s&name=%s&kind=%s", namespace, name, kind)
	data := fmt.Sprintf(`Source "%s" created`, name)
	instrumentationConfigAddedEventBatcher.AddEvent(sse.MessageTypeSuccess, data, target)
}

func handleModifiedInstrumentationConfig(instruConfig *v1alpha1.InstrumentationConfig) {
	namespace := instruConfig.Namespace
	name, kind, err := commonutils.ExtractWorkloadInfoFromRuntimeObjectName(instruConfig.Name)
	if err != nil {
		genericErrorMessage(sse.MessageEventModified, consts.InstrumentationConfig, err.Error())
		return
	}

	target := fmt.Sprintf("namespace=%s&name=%s&kind=%s", namespace, name, kind)
	data := fmt.Sprintf(`Source "%s" updated`, name)
	instrumentationConfigModifiedEventBatcher.AddEvent(sse.MessageTypeSuccess, data, target)
}

func handleDeletedInstrumentationConfig(instruConfig *v1alpha1.InstrumentationConfig) {
	namespace := instruConfig.Namespace
	name, kind, err := commonutils.ExtractWorkloadInfoFromRuntimeObjectName(instruConfig.Name)
	if err != nil {
		genericErrorMessage(sse.MessageEventDeleted, consts.InstrumentationConfig, err.Error())
		return
	}

	target := fmt.Sprintf("namespace=%s&name=%s&kind=%s", namespace, name, kind)
	data := fmt.Sprintf(`Source "%s" deleted`, name)
	instrumentationConfigDeletedEventBatcher.AddEvent(sse.MessageTypeSuccess, data, target)
}
